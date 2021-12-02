import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({
    required: true,
    index: true,
    ref: () => User,
  })
  user!: Ref<User>
  @prop({
    required: true,
  })
  message!: string
}

export const MessageModel = getModelForClass(Message)
