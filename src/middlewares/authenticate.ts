import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, forbidden } from '@hapi/boom'

export default async function authenticate(ctx: Context, next: Next) {
  const token = ctx.headers.token
  if (!token) {
    return ctx.throw(badRequest('No token provided'))
  }
  if (typeof token !== 'string') {
    return ctx.throw(badRequest('Bad token'))
  }
  const user = await UserModel.findOne({ token: token })
  if (!user) {
    return ctx.throw(forbidden('Auth failed'))
  }
  ctx.state.user = user

  return next()
}
