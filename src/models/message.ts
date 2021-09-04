import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text: string
  @prop({ required: false })
  author: string
}

export const messageModel = getModelForClass(Message)
