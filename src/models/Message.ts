import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: string
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>
}

export const MessageModel = getModelForClass(Message)

export async function findMessage(_id: string) {
  const message = await MessageModel.findById(_id)
  if (!message) {
    throw new Error('Message not found')
  }
  return message
}

// export async function findAllMessagesByUserId(userId: User) {
//   const messages = await MessageModel.find({ userId }).exec()
//   if (!messages) {
//     throw new Error('Message not found')
//   }
//   return messages
// }

export function createNewMessage(messageOptions: {
  text: string
  userId: User
}) {
  return MessageModel.create(messageOptions)
}

export async function findAndUpdateMessage(messageOptions: {
  text: string
  _id: string
  userId?: User
}) {
  const message = await MessageModel.findOneAndUpdate(
    {
      userId: messageOptions.userId,
      _id: messageOptions._id,
    },
    { text: messageOptions.text },
    {}
  )
  if (!message) {
    throw new Error('Message not found')
  }
  return message
}

export async function findAndDeleteMessage(_id: string) {
  const message = await MessageModel.deleteOne({ _id })
  if (message.acknowledged) {
    throw new Error('Message not found')
  }
  return 'successfully deleted'
}
