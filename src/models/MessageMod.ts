import { MessagesIdValid, MessagesTextValid } from '@/validators/MessageVal'
import { User } from '@/models/User'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class MessageMod {
  @prop({ required: true })
  text!: string
  id!: string

  @prop({ required: true })
  user!: string
}

export const MessageModel = getModelForClass(MessageMod)
