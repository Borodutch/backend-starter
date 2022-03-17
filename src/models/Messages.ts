import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
} from '@typegoose/typegoose'
import { User } from '@/models/User'
import _ = require('lodash')

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ auto: true })
  _id!: mongoose.Schema.Types.ObjectId
  @prop({ required: true, index: true, ref: () => User })
  user!: Ref<User>
  @prop({ required: true })
  text!: string
}

export const MessageModel = getModelForClass(Message)
