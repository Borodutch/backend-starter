import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './user'

export class Message {
  @prop({ require: true })
  public message?: string

  @prop({ ref: User })
  public user?: Ref<User>
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
