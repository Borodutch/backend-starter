import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import ValidMessage from '@/validators/Message'
import ValidUser from '@/validators/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: ValidMessage['text']
  @prop({ ref: () => User, required: true })
  user!: Ref<User>
}

export const MessageModel = getModelForClass(Message)

export async function findAllMessagesByUser(user: ValidUser) {
  const messages = await MessageModel.find({ user: user.id })
  if (!messages) {
    return notFound('Messages not found')
  }
  return messages
}

export function createNewMessage(text: ValidMessage['text'], user: ValidUser) {
  return MessageModel.create({ text, user })
}

export async function findAndUpdateMessage(
  messageId: ValidMessage['_id'],
  currentUser: Ref<User>,
  text: ValidMessage['text']
) {
  const message = await MessageModel.findOneAndUpdate(
    { _id: messageId, user: currentUser },
    { text }
  )
  if (!message) {
    return notFound('Message not found')
  }
  return message
}

export async function findAndDeleteMessage(messageId: ValidMessage['_id']) {
  const message = await MessageModel.deleteOne({ _id: messageId })
  if (message.acknowledged) {
    return notFound('Message not deleted')
  }
  return 'successfully deleted'
}
