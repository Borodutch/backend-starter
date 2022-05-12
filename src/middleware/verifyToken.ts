import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, forbidden, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function verifyToken(ctx: Context, next: Next) {
  const token = ctx.header.token as string

  if (!token) {
    return ctx.throw(forbidden())
  }

  try {
    verify(token)
  } catch (error) {
    return ctx.throw(forbidden())
  }

  const user = await UserModel.findOne({ token })

  if (!user) {
    return ctx.throw(unauthorized())
  }

  if (!user.token) {
    return ctx.throw(badRequest())
  }

  ctx.state.user = user

  return next()
}
