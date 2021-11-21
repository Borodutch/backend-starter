import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true, ref: () => User, type: () => String })
  author: Ref<User, string>
  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
