import { prop, getModelForClass } from '@typegoose/typegoose'
import { User } from './user'

export class Message {
  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message)
