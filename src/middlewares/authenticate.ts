import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden, notFound } from '@hapi/boom'

export default async function authenticate(ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    return ctx.throw(forbidden('You are not authorized'))
  }
  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound('User not found'))
  }
  ctx.state.user = user
  return next()
}
