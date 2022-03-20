import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  id!: string
  @prop({ required: true, index: true, ref: () => User })
  user!: Ref<User>
  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)
