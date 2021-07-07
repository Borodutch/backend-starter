import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ index: true, required: true })
  user: Ref<User>

  @prop({ required: true })
  text: string

  // Mongo Acess
  _doc: any
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export function createMessage(user: User, text: string) {
  return new MessageModel({ user, text }).save()
}

export function readMessageById(id: string) {
  return MessageModel.findById(id)
}

export function updateMessageById(id: string, text: string) {
  return MessageModel.findOneAndUpdate({ _id: id }, { text })
}

export function deleteMessageById(id: string) {
  return MessageModel.findOneAndDelete({ _id: id })
}
