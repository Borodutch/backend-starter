import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  text: string
  @prop({ required: true, ref: () => User })
  author: Ref<User>
}

export const MessageModel = getModelForClass(Message)
