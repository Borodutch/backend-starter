import { prop, getModelForClass } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ index: true, required: true })
  title: string
  @prop({ index: true, required: true })
  body: string
  @prop({ index: true, required: true, unique: false })
  author: User
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
