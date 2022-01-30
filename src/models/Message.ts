import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

export class Message {
  @prop({ ref: () => User, required: true })
  public author!: Ref<User>

  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)

export function createMessage(author: Ref<User>, text: string) {
  return MessageModel.create({ author, text })
}

export function getMessages(author: Ref<User>) {
  return MessageModel.find({ author })
}

export function deleteMessage(id: string) {
  return MessageModel.findOneAndDelete({ _id: id })
}

export function updateMessage(id: string, updatedText: string) {
  return MessageModel.findOneAndUpdate({
    id: id,
    text: updatedText,
    new: true,
    returnOriginal: false,
  })
}
