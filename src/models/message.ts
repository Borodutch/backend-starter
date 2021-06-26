import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './user'

class Message {
  @prop({ required: true })
  author: Ref<User>
  @prop({ required: true })  
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
