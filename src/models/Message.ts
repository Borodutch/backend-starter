import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ index: true, required: true })
  text!: string
  @prop({ index: true, required: true, ref: () => User })
  user!: Ref<User>
}

export const MessageModel = getModelForClass(Message)
