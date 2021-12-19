import * as findorcreate from 'mongoose-findorcreate'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import {
  Ref,
  getModelForClass,
  modelOptions,
  plugin,
  pre,
  prop,
} from '@typegoose/typegoose'
import { User } from '@/models/user'
import { sign } from '@/helpers/jwt'

@plugin(findorcreate)
@pre<Message>('save', async function () {
  this.token = await sign({ id: this.id })
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class Message extends FindOrCreate {
  @prop({ index: true })
  content!: string
  @prop({ required: true, index: true })
  name!: Ref<User>

  @prop()
  id?: Ref<Message>
  @prop({ index: true, unique: true })
  token?: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export function findOrCreateMessage(messageOptions: {
  name: Ref<User>
  content: string
}) {
  return MessageModel.findOrCreate(messageOptions)
}
