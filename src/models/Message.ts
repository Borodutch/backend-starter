import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
})
class Message {
  @prop({ required: true })
  text!: string

  @prop({ ref: () => User, index: true, required: true })
  author!: Ref<User>
}

export const MessageModel = getModelForClass(Message)
