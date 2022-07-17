import { ObjectId } from 'mongoose'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ index: true, lowercase: true })
  email?: string
  @prop({ index: true, lowercase: true })
  facebookId?: string
  @prop({ index: true })
  telegramId?: number
  @prop({ required: true, index: true })
  name!: string

  @prop({ index: true, unique: true })
  token?: string

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

export const UserModel = getModelForClass(User)

export async function findOrCreateUser(loginOptions: {
  name: string
  _id?: ObjectId
  email?: string
  facebookId?: string
  telegramId?: number
  token?: string
}) {
  const user = await UserModel.findOneAndUpdate(
    loginOptions,
    {},
    {
      upsert: true,
      new: true,
    }
  )
  if (!user) {
    throw new Error('User not found')
  }
  if (!user.token) {
    user.token = await sign({ _id: user._id as unknown as string })
    await user.save()
  }
  return user
}
