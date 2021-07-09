import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  user: Ref<User>
  @prop({ required: true })
  message: string
}

export const messageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function getAllMessages(user: User) {
  return messageModel.find({ user: user })
}

export async function createMessage(message: string, user: User) {
  return new messageModel({ message: message, user: user }).save()
}

export async function deleteOneMessage(id: string) {
  return messageModel.findByIdAndDelete(id)
}

export async function changeMessage(id: string, message: string) {
  await messageModel.findOneAndUpdate(
    { _id: id },
    { message: message },
    { useFindAndModify: false }
  )
  return messageModel.findById(id)
}
