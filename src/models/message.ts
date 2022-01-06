import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true, ref: () => User })
  author!: Ref<User>
  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)
