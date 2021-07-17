import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './user'

export class Message {
  @prop({ required: true })
  text: string
  @prop({ required: true })
  author: Ref<User>
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export function createMessage(text: string, author: Ref<User>) {
  return new MessageModel({ text, author }).save()
}

export function getMessages(author: Ref<User>) {
  return MessageModel.find(author)
}

export function findMessageById(id: string) {
  return MessageModel.findById(id)
}

export function deleteMessageById(id: string) {
  return MessageModel.findByIdAndDelete({ _id: id })
}

export function updateMessage(id: string, text: string) {
  return MessageModel.findByIdAndUpdate({ _id: id }, { text })
}
