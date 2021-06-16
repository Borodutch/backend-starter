import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {
  @prop()
  body: string

  @prop()
  createdBy: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

interface MessageOptions {
  body: string | string[]
  createdBy: string | string[]
}

export async function createMessage(messageOptions: MessageOptions) {
  let message: DocumentType<Message> | undefined
  message = new MessageModel({
    body: messageOptions.body,
    createdBy: messageOptions.createdBy,
  })
  await message.save()
  return message
}

export async function getAllMessages() {
  return await MessageModel.find()
}

export async function getMessage(id: string) {
  return await MessageModel.findById(id)
}

export async function updateMessage(id: string, data: any) {
  let message: DocumentType<Message> | undefined
  message = await MessageModel.findById(id)
  if (data.body) {
    message.body = data.body
  }
  if (data.createdBy) {
    message.createdBy = data.createdBy
  }

  return await message.save()
}

export async function deleteMessage(id: string) {
  return await MessageModel.findByIdAndDelete(id)
}
