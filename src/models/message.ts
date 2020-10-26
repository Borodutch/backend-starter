import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop()
  msg: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true}
})
