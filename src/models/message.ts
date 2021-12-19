import * as findorcreate from 'mongoose-findorcreate'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import {
  getModelForClass,
  modelOptions,
  plugin,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'
import { User } from './user'

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

  // strippedAndFilled({
  //   withExtra = false,
  //   withToken = true,
  // }: { withExtra?: boolean; withToken?: boolean } = {}) {
  //   const stripFields = ['createdAt', 'updatedAt', '__v']
  //   if (!withExtra) {
  //     stripFields.push('token')
  //     stripFields.push('email')
  //     stripFields.push('facebookId')
  //     stripFields.push('telegramId')
  //   }
  //   if (!withToken) {
  //     stripFields.push('token')
  //   }
  //   return omit(this, stripFields)
  // }
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
