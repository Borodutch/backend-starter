import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest } from '@hapi/boom'
import { toString } from 'lodash'
import { verify } from '@/helpers/jwt'

export default async function authMiddleware(ctx: Context, next: Next) {
  const token = toString(ctx.request.headers.token)
  try {
    verify(token)
  } catch (error) {
    return ctx.throw(badRequest())
  }
  ctx.state.user = await UserModel.findOne({ token })
  return next()
}
