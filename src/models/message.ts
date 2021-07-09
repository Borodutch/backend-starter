import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ index: true, required: true })
  user: () => 'User'

  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
