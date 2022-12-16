import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden, notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function (ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    ctx.throw(unauthorized('Token is absent'))
  }

  try {
    verify(token.toString())
  } catch (err) {
    return ctx.throw(forbidden('Invalid token'))
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    ctx.throw(notFound('There is no such user'))
  }
  ctx.state.user = user

  return next()
}
