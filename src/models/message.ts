import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

class Message {
  @prop({ required: true })
  body: string

  @prop({ required: true, ref: User })
  author: Ref<User>
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
