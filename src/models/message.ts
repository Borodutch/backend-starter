import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  user_id!: string
  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)