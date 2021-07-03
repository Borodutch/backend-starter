import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  email?: string
  @prop()
  author: Ref<User>
  @prop()
  text: string
}

export const MessageModel = getModelForClass(Message)
