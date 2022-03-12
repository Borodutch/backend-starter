import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop()
  public message?: string
}

export const MessageModel = getModelForClass(Message)

export async function findOrCreateMessage(messageOptions: { message: string }) {
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
  return message
}

export async function getAll() {
  const allMessages = await MessageModel.find({})
  if (!allMessages) {
    throw new Error('Message not found')
  }
  return allMessages
}

export async function getById(id: string) {
  const messageId = await MessageModel.findById(id)
  if (!messageId) {
    throw new Error('Message not found')
  }
  return messageId
}

export async function removeById(id: string) {
  const messageId = await MessageModel.findOneAndRemove({ id: id })
  if (!messageId) {
    throw new Error('Message is not found')
  }
  return messageId
}

export async function editById(
  id: string,
  messageOptions: {
    message: string
  }
) {
  const messageId = await MessageModel.findOneAndUpdate(
    { _id: id },
    { $set: { message: messageOptions.message } },
    { upsert: true }
  )
  return messageId
}
