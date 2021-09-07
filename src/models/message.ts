import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  text: string
  @prop({ ref: () => User })
  author?: Ref<User>
}

export const MessageModel = getModelForClass(Message)
