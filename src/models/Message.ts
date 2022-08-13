import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: string
  @prop({ required: true, index: true, ref: () => User })
  author!: Ref<User>
}

export const MessageModel = getModelForClass(Message)
