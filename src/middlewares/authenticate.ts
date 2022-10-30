import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function authenticate(ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    return ctx.throw(unauthorized())
  }
  try {
    verify(token.toString())
  } catch {
    return ctx.throw(notFound())
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound())
  }
  ctx.state.user = user
  return next()
}
