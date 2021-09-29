import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true, index: true })
  text: string
}

export const MessageModel = getModelForClass(Message)
