import { prop, getModelForClass, Ref, DocumentType } from '@typegoose/typegoose'
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

export async function createMessage(user: User, text: Message) {
  return await new MessageModel({ user, text }).save()
}

export function readMessageById(id: string) {
  return MessageModel.findById(id)
}

export function readMessagesByUser(user: User) {
  return MessageModel.find(user)
}

export function updateMessageById(id: string, user: User, text: object) {
  return MessageModel.findOneAndUpdate({ id, user }, text)
}

export function deleteMessageById(user: User, id: string) {
  return MessageModel.findOneAndDelete({ _id: id, user })
}
