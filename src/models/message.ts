import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true, index: true })
  body: string
  @prop({ required: true, index: true })
  user: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
