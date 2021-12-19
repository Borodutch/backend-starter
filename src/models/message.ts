import * as findorcreate from 'mongoose-findorcreate'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import {
  Ref,
  getModelForClass,
  modelOptions,
  plugin,
  prop,
} from '@typegoose/typegoose'
import { User } from '@/models/user'

@plugin(findorcreate)
@modelOptions({ schemaOptions: { timestamps: true } })
export class Message extends FindOrCreate {
  @prop({ required: true })
  text!: string
  @prop({ required: true, index: true })
  author!: Ref<User>
}

export const MessageModel = getModelForClass(Message)

export function findOrCreateMessage(author: Ref<User>, text: string) {
  return MessageModel.findOrCreate(author, text)
}
