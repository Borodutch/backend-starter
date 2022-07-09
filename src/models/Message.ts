import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ required: true, index: true })
  text?: string
  @prop({ ref: () => User })
  author!: Ref<User>
}

export const MessageModel = getModelForClass(Message)
