import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'
export class Message {
  @prop({ required: true, index: true, ref: () => User })
  author!: Ref<User>
  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
