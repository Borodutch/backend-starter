import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'
import MongoDocument from '@/models/MongoDocument'

export class User extends MongoDocument<User> {
  @prop({ index: true, lowercase: true })
  email?: string
  @prop({ index: true, lowercase: true })
  facebookId?: string
  @prop({ index: true })
  telegramId?: number
  @prop({ required: true, index: true })
  name: string

  @prop({ required: true, index: true, unique: true })
  token: string

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
    return omit(this._doc, stripFields)
  }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

interface LoginOptions {
  email?: string
  facebookId?: string
  telegramId?: number

  name: string
}

export async function getOrCreateUser(loginOptions: LoginOptions) {
  if (!loginOptions.name) {
    throw new Error()
  }
  let user: DocumentType<User> | undefined
  // Try email
  if (loginOptions.email) {
    user = await UserModel.findOne({ email: loginOptions.email })
  }
  // Try facebook id
  if (!user && loginOptions.facebookId) {
    user = await UserModel.findOne({
      facebookId: loginOptions.facebookId,
    })
  }
  // Try telegram id
  if (!user && loginOptions.telegramId) {
    user = await UserModel.findOne({
      telegramId: loginOptions.telegramId,
    })
  }
  if (!user) {
    // Check if we have credentials
    if (
      !(
        loginOptions.email ||
        loginOptions.facebookId ||
        loginOptions.telegramId
      )
    ) {
      throw new Error()
    }
    const params: Record<string, unknown> = { name: loginOptions.name }
    if (loginOptions.email) {
      params.email = loginOptions.email
    }
    if (loginOptions.facebookId) {
      params.facebookId = loginOptions.facebookId
    }
    if (loginOptions.telegramId) {
      params.telegramId = loginOptions.telegramId
    }
    user = await new UserModel({
      ...params,
      token: await sign(params),
    }).save()
  }
  return user
}
