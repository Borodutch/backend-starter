import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function emailMiddleware(ctx: Context, next: Function) {
  const token = ctx.headers.token

  if (!token) {
    return ctx.throw(badRequest())
  }

  if (typeof token !== 'string') {
    return ctx.throw(badRequest())
  }

  try {
    verify(token)
  } catch (err) {
    return ctx.throw(badRequest())
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound())
  }
  ctx.state.user = user
  return next()
}
