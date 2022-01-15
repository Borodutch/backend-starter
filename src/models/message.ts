import { getModelForClass, prop, DocumentType } from '@typegoose/typegoose'
import { text } from 'stream/consumers'

export class Message {
  @prop({ required: true })
  text!: string

const MessageModel = getModelForClass(Message)

export async function createMessage(text: string) {
  return new MessageModel({ text}).save
}

export async function updateMessage(id: string, newText: string) {
  return MessageModel.findOneAndUpdate({ _id: id, text: newText, new: true })
}
export async function getMessages() {
  return MessageModel.find({})
}

export async function deleteMessage(id: string) {
  return MessageModel.deleteOne({ id: id })
}
