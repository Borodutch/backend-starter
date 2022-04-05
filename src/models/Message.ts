import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import ValidUser from '@/validators/UserId'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: string
  @prop({ ref: () => User, required: true })
  user!: Ref<User>
}

export const MessageModel = getModelForClass(Message)

export async function findAllMessagesByUser(user: ValidUser) {
  console.log(user)
  const messages = await MessageModel.find({ user: user._id })
  console.log(messages)
  if (!messages) {
    return notFound('Messages not found')
  }
  return messages
}

export function createNewMessage(messageOptions: {
  text: string
  user: ValidUser
}) {
  return MessageModel.create(messageOptions)
}

export async function findAndUpdateMessage(
  messageOptions: {
    _id: string
    user: ValidUser
  },
  changeOptions: { text: string }
) {
  const message = await MessageModel.findOneAndUpdate(
    messageOptions,
    changeOptions
  )
  if (!message) {
    return notFound('Message not found')
  }
  return message
}

export async function findAndDeleteMessage(_id: string) {
  const message = await MessageModel.deleteOne({ _id })
  if (message.acknowledged) {
    return notFound('Message not deleted')
  }
  return 'successfully deleted'
}
