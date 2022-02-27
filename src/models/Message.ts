// import * as msg from '@/validators/Message'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ index: true, lowercase: true })
  messageData!: string
  @prop({ index: true })
  user_id?: number
  @prop({ index: true, lowercase: true })
  source_url?: string
  @prop({ index: true, lowercase: true })
  company_name?: string
}

export const MessageModel = getModelForClass(Message)

export async function findMessage(messageOptions: { _id: string }) {
  const message = await MessageModel.findById(messageOptions._id)
  if (!message) {
    throw new Error('Message not found')
  }
  return message
}

export function createNewMessage(messageOptions: {
  messageData: string
  user_id: number
}) {
  return MessageModel.create(messageOptions)
}

export async function findAndUpdateMessage(messageOptions: {
  messageData: string
  _id: string
  user_id?: number
}) {
  const message = await MessageModel.findOneAndUpdate(
    {
      user_id: messageOptions.user_id,
      _id: messageOptions._id,
    },
    { messageData: messageOptions.messageData },
    {}
  )
  if (!message) {
    throw new Error('Message not found')
  }
  return message
}

export async function findAndDeleteMessage(messageOptions: { _id: string }) {
  const message = await MessageModel.deleteOne(messageOptions)
  if (message.acknowledged) {
    throw new Error('Message not found')
  }
  return 'successfully deleted'
}
