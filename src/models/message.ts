import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ index: true, required: true })
  user: Ref<User>

  @prop({ index: true })
  text?: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function createMessage(user: User, body: object) {
  return await new MessageModel({ body, user }).save()
}

export async function readMessageById(id: string) {
  return MessageModel.findById(id)
}
export async function readMessagesByUser(user: User) {
  return MessageModel.find(user)
}

export async function updateMessageById(
  user: User,
  id: string,
  body: { text: string }
) {
  let { text } = body
  return MessageModel.findByIdAndUpdate(id, { text })
}

export async function deleteMessageById(user: User, id: string) {
  return MessageModel.findByIdAndDelete({ _id: id, user })
}
