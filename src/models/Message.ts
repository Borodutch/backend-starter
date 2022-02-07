import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ index: true, lowercase: true })
  messageData!: string
  @prop({ required: true, index: true, unique: true })
  messageId?: number
  @prop({ index: true, lowercase: true })
  user_id?: number
  @prop({ index: true, lowercase: true })
  source_url?: string
  @prop({ index: true, lowercase: true })
  company_name?: string
}

export const MessageModel = getModelForClass(Message)

export async function findMessage(messageOptions: {
  messageId: number
  user_id?: number
}) {
  const message = await MessageModel.findOneAndUpdate(messageOptions)
  if (!message) {
    throw new Error('Message not found')
  }
  return message
}

export async function createNewMessage(messageOptions: {
  messageData: string
  user_id: number
  messageId?: number
}) {
  const message = await MessageModel.create(messageOptions)
  if (!message.messageId) {
    message.messageId = message._id
  }
  return message
}

export async function findAndUpdateMessage(messageOptions: {
  messageData?: string
  user_id?: number
  messageId: number
}) {
  const message = await MessageModel.findOneAndUpdate(
    {
      user_id: messageOptions.user_id,
      messageId: messageOptions.messageId,
    },
    { messageData: messageOptions.messageData }
  )
  if (!message) {
    throw new Error('Message not found')
  }
  return message
}

export async function findAndDeleteMessage(messageOptions: {
  messageData?: string
  user_id?: number
  messageId: number
}) {
  const message = await MessageModel.findOneAndDelete(messageOptions)
  if (!message) {
    throw new Error('Message not found')
  }
  return 'successfully deleted'
}
