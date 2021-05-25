import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './user'

export class Message {
  @prop({ required: true, index: true, ref: User })
  author: Ref<User>
  @prop({ required: true })
  content: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: {
    timestamps: true,
  },
})
