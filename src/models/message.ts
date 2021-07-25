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

export async function createMessage(user: User, text: string) {
  return new MessageModel({
    user,
    text,
  }).save()
}

export async function readMessages(user: User) {
  return MessageModel.find(user)
}

export async function updateMessageById(_user: User, id: string, text: string) {
  return MessageModel.findByIdAndUpdate({ id, text })
}

export async function deleteMessageById(user: User, id: string) {
  return MessageModel.findByIdAndDelete({ _id: id, user })
}
