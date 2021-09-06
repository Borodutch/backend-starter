import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  text: string
  @prop({ required: false, ref: () => User })
  author: Ref<User>
}

export const messageModel = getModelForClass(Message)
