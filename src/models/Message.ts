import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

import { ObjectId } from 'mongoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  _id!: ObjectId

  @prop({ required: true })
  text!: string

  @prop({ required: true, ref: User, index: true })
  author!: Ref<User>
}

export const MessageModel = getModelForClass(Message)
