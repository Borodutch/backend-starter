import { DocumentType, getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ index: true, required: true })
  user: Ref<User>

  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export function createMessage(user: User, text: string) {
  return new MessageModel({
    user,
    text,
  }).save()
}

export function readMessages(user: User, text: string) {
  return MessageModel.find({user, text})
}

export function updateMessageById(_user: User, id: string, text: string) {
  return MessageModel.findByIdAndUpdate({ id, text })
}

export function deleteMessageById(user: User, id: string) {
  return MessageModel.findByIdAndDelete({ _id: id, user })
}
