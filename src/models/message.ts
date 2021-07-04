import { prop, getModelForClass, Ref, DocumentType } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ index: true, required: true })
  user: Ref<User>

  @prop({ required: true })
  text: string

  _doc: any
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function createMessage(user: User, text: Message) {
  return await new MessageModel({ user, text }).save()
}

export async function readMessageById(id: string) {
  return await MessageModel.findById(id)
}

export async function readMessagesByUser(user: User) {
  return await MessageModel.find(user)
}

export async function updateMessageById(id: string, text: object) {
  return await MessageModel.findOneAndUpdate({ _id: id }, text)
}

export async function deleteMessageById(id: string) {
  return await MessageModel.findOneAndDelete({ _id: id })
}
