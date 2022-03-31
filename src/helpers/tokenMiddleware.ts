import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function tokenMiddleware(ctx: Context, next: Next) {
  const token = ctx.header.token as string
  if (!token) {
    return ctx.throw(forbidden())
  }
  try {
    verify(token)
  } catch (err) {
    return ctx.throw(forbidden())
  }
  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound())
  }
  ctx.state.user = user
  return next()
}
