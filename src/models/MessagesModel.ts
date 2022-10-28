import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

export class Message {
  @prop({ required: true })
  text!: string

  @prop({ required: true, index: true, ref: () => User })
  author!: Ref<User>
}

export const MessagesModel = getModelForClass(Message)
