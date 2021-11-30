import { Ref, getModelForClass, prop } from '@/typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop(
    required: true,
    index: true,
    ref: () => User,
  )
  username!: Ref<User>
  @prop(
    required: true,
    index: true,
  )
  message!: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
