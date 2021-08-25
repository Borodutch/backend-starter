import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text: string
}

export const messageModel = getModelForClass(Message)
