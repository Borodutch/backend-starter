import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  user: Ref<User>
  @prop({ required: true })
  message: string
}

export const messageModel = getModelForClass(Message)

export async function getAllMessages(user: User) {
  return await messageModel.find({ user: user })
}

export async function getMessage(id: string, user: User) {
  return await messageModel.find({ _id: id, user: user })
}

export async function createMessage(message: string, user: User) {
  return await new messageModel({ message: message, user: user }).save()
}

export async function deleteOneMessage(id: string, user: User) {
  return await messageModel.findByIdAndDelete({ _id: id, user: user })
}

export async function deleteMessages(id: string[], user: User) {
  let userMessages: Message[] = []
  for (let i = 0; i < id.length; i++) {
    userMessages.push(
      await messageModel.findByIdAndDelete({ _id: id[i], user: user })
    )
  }
  return userMessages
}

export async function changeMessage(id: string, message: string, user: User) {
  return await messageModel.findOneAndUpdate(
    { _id: id, user: user },
    { message: message },
    { useFindAndModify: false }
  )
}
