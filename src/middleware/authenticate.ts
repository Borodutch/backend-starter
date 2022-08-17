import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function (ctx: Context, next: Next) {
  const { token } = ctx.request.headers
  if (typeof token !== 'string') {
    return ctx.throw(badRequest('invalid token'))
  }
  try {
    verify(token)
  } catch (err) {
    return ctx.throw(badRequest('invalid token', { data: err }))
  }

  const user = await UserModel.findOne({ token })
  if (!user) ctx.throw(notFound('User not found'))
  ctx.state.user = user

  return next()
}
