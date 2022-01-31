import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

export class Message {
  @prop({ ref: () => User, required: true })
  public author!: Ref<User>

  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)
