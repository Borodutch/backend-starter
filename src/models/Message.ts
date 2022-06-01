import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
class Message {
  @prop({ required: true })
  text!: string

  @prop({ required: true })
  author!: string
}

export const MessageModel = getModelForClass(Message)
