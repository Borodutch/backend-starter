import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden, notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function (ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    return ctx.throw(unauthorized('Token is absent'))
  }

  try {
    verify(token.toString())
  } catch (err) {
    return ctx.throw(forbidden('Access denied'))
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound('There is no such user'))
  }
  ctx.state.user = user

  return next()
}
