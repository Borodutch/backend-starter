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

export async function findMessage(_id: string) {
  const message = await MessageModel.findById(_id)
  if (!message) {
    return notFound('Message not found')
  }
  return message
}

export async function findAllMessagesByUser(user: User) {
  console.log(user)
  const messages = await MessageModel.find(user)
  console.log(messages)
  if (!messages) {
    return notFound('Messages not found')
  }
  return messages
}

export function createNewMessage(messageOptions: { text: string; user: User }) {
  return MessageModel.create(messageOptions)
}

export async function findAndUpdateMessage(messageOptions: {
  text: string
  _id: string
  name?: ValidUser
}) {
  const message = await MessageModel.findOneAndUpdate(
    {
      name: messageOptions.name,
      _id: messageOptions._id,
    },
    { text: messageOptions.text },
    {}
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
