import { prop, getModelForClass, DocumentType, Ref } from '@typegoose/typegoose'
import { User } from './user'

export class Message {
  @prop()
  text: string

  @prop()
  author: Ref<User>
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

interface MessageOptions {
  text: string
  author: Ref<User>
}

export async function createMessage(messageOptions: MessageOptions) {
  let message: DocumentType<Message> | undefined
  message = new MessageModel({
    text: messageOptions.text,
    author: messageOptions.author,
  })
  await message.save()
  return message
}

export async function getAllMessages() {
  const messages = await MessageModel.find()
  return messages
}

export async function getMessage(id: string) {
  const message = await MessageModel.findById(id)
  return message
}

export async function updateMessage(id: string, data: any) {
  let message: DocumentType<Message> | undefined
  message = await MessageModel.findById(id)
  if (data.text) {
    message.text = data.text
  }
  if (data.author) {
    message.author = data.author
  }

  await message.save()
  return message
}

export async function deleteMessage(id: string) {
  await MessageModel.findByIdAndDelete(id)
  return `The message with id: ${id} is deleted`
}
