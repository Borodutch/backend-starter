import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ index: true, lowercase: true, unique: false })
  author!: string
  @prop({ index: true, lowercase: false, unique: false }) //does it need index?
  messageText!: string
  @prop({ index: true, unique: true })
  token?: string

  strippedAndFilled({
    withExtra = false,
    withToken = true,
  }: { withExtra?: boolean; withToken?: boolean } = {}) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    if (!withExtra) {
      stripFields.push('token')
      stripFields.push('author')
      stripFields.push('messageText')
    }
    if (!withToken) {
      stripFields.push('token')
    }
    return omit(this, stripFields)
  }
}

export const MessageModel = getModelForClass(Message)

export async function findOrCreateMessage(messageOptions: {
  author: string
  token?: string
}) {
  const message = await MessageModel.findOneAndUpdate(
    messageOptions,
    {},
    {
      upsert: true,
      new: true,
    }
  )
  if (!message) {
    throw new Error('Message not found')
  }
  if (!message.token) {
    message.token = await sign({ id: message.id })
    await message.save()
  }
  return message
}
