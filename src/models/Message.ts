import { User } from '@/models/User'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ required: true, index: true })
  title?: string
  @prop({ required: true, index: true })
  body?: string
  @prop({ required: true, index: true })
  _id?: string
  @prop({ required: true, index: true })
  authoruser!: User
}

export const MessageModel = getModelForClass(Message)
