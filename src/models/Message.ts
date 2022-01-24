import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true, index: true })
  message!: string
}

export const MessageModel = getModelForClass(Message)