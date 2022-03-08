import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>
  @prop({ required: true })
  textMessage!: string
}

export const MessageModel = getModelForClass(Message)
