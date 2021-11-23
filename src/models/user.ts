import * as findorcreate from 'mongoose-findorcreate'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass, plugin, pre, prop } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'

@plugin(findorcreate)
@pre<User>('save', async function () {
  this.token = await sign({ id: this.id })
})
export class User extends FindOrCreate {
  @prop({ index: true, lowercase: true })
  email?: string
  @prop({ index: true, lowercase: true })
  facebookId?: string
  @prop({ index: true })
  telegramId?: number
  @prop({ required: true, index: true })
  name!: string

  @prop({ required: true, index: true, unique: true })
  token!: string

  strippedAndFilled({
    withExtra = false,
    withToken = true,
  }: { withExtra?: boolean; withToken?: boolean } = {}) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    if (!withExtra) {
      stripFields.push('token')
      stripFields.push('email')
      stripFields.push('facebookId')
      stripFields.push('telegramId')
    }
    if (!withToken) {
      stripFields.push('token')
    }
    return omit(this, stripFields)
  }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

export function findOrCreateUser(loginOptions: {
  name: string
  email?: string
  facebookId?: string
  telegramId?: number
}) {
  return UserModel.findOrCreate(loginOptions)
}
