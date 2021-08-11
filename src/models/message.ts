import mongoose = require('mongoose')
import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ index: true })
  title?: string
  @prop({ index: true })
  body?: string
  @prop({ ref: () => User })
  user?: Ref<User>
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
