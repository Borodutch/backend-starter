import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import ValidMessage from '@/validators/Message'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: ValidMessage['text']
  @prop({ ref: () => User, required: true })
  user!: Ref<User>
}

export const MessageModel = getModelForClass(Message)

export async function findAllMessagesByUser(user: User) {
  const messages = await MessageModel.find({ user })
  if (!messages) {
    return notFound('Messages not found')
  }
  return messages
}

export function createNewMessage(text: ValidMessage['text'], user: User) {
  return MessageModel.create({ text, user })
}

export async function findAndUpdateMessage(
  _id: ValidMessage['_id'],
  user: User,
  text: ValidMessage['text']
) {
  const message = await MessageModel.findOneAndUpdate({ _id, user }, { text })
  if (!message) {
    return notFound('Message not found')
  }
  return message
}

export async function findAndDeleteMessage(
  _id: ValidMessage['_id'],
  user: User
) {
  const message = await MessageModel.deleteOne({ _id, user })
  if (message.acknowledged) {
    return notFound('Message not deleted')
  }
  return 'successfully deleted'
}
