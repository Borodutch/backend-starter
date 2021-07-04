import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: false })
  user: Ref<User>
  @prop({ required: true })
  message: string
}

export const messageModel = getModelForClass(Message)

export async function getAllMessages() {
  return await messageModel.find({})
}

export async function getMessage(id: string) {
  return await messageModel.find({ _id: id })
}

export async function createMessage(message: string) {
  return await new messageModel({ message: message }).save()
}

export async function deleteOneMessage(id: string) {
  return await messageModel.findByIdAndDelete({ _id: id })
}

export async function deleteMessages(id: string[]) {
  let userMessages: Message[] = []
  for (let i = 0; i < id.length; i++) {
    userMessages.push(await messageModel.findByIdAndDelete({ _id: id[i] }))
  }
  return userMessages
}

export async function changeMessage(id: string, message: string) {
  return await messageModel.findOneAndUpdate(
    { _id: id },
    { message: message },
    { useFindAndModify: false }
  )
}
