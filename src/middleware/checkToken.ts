import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden, notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function (ctx: Context, next: Next) {
  const { token } = ctx.request.headers
  if (typeof token !== 'string') {
    return ctx.throw(unauthorized('invalid token'))
  }
  try {
    verify(token)
  } catch (err) {
    return ctx.throw(forbidden('invalid token', { data: err }))
  }

  const user = await UserModel.findOne({ token })
  if (!user) ctx.throw(notFound('User not found'))
  ctx.state.user = user

  return next()
}
