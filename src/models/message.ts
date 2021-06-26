import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

class Message {
  @prop({ required: true })
  text: string

  @prop({ required: true, ref: User })
  author: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
