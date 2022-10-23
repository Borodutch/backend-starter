import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { badRequest } from '@hapi/boom'

export default async function authenticate(ctx: Context, next: Next) {
  if (!ctx.headers.token) {
    return ctx.throw(badRequest('No user token provided'))
  }
  const user = await UserModel.findOne({ token: ctx.header.token })
  if (!user) {
    return ctx.throw(badRequest('No user with such token'))
  }
  ctx.state.user = user
  return next()
}
