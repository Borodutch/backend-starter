import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true, index: true })
  text: String
}

export const MessageModel = getModelForClass(Message)
