import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

export class Message {
  @prop({ ref: () => User, required: true })
  public author!: Ref<User>

  @prop({ required: true })
  text!: string
}

const MessageModel = getModelForClass(Message)

export function createMessage(author: Ref<User>, text: string) {
  return new MessageModel({ author, text }).save()
}

export function getMessages(author: Ref<User>) {
  return MessageModel.find({ author }).exec()
}

export function deleteMessage(id: string) {
  return MessageModel.findOneAndDelete({ _id: id })
}

export function updateMessage(id: string, updatedText: string) {
  return MessageModel.findOneAndUpdate({
    _id: id,
    text: updatedText,
    new: true,
    returnOriginal: false,
  })
}
