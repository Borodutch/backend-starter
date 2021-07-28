import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  text: string

  @prop({ required: true, ref: () => User })
  user: Ref<User>
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
