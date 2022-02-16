import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from './User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  user?: User
  @prop({ required: true })
  textMessage?: string
}

export const MessageModel = getModelForClass(Message)
