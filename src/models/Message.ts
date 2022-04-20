import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: string
  @prop({ required: true })
  user!: string
}

export const MessageModel = getModelForClass(Message)
