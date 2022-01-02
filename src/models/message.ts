import {
  Ref,
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
} from '@typegoose/typegoose'
import { User } from '@/models/user'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: Ref<User>
  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)
