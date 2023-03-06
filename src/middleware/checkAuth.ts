import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, forbidden, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async (ctx: Context, next: Next) => {
  const { token } = ctx.headers

  if (!token) {
    return ctx.throw(forbidden())
  }

  if (typeof token !== 'string') {
    return ctx.throw(badRequest())
  }

  try {
    const { id } = verify(token)
    if (!id) {
      return ctx.throw(forbidden())
    }
  } catch (error) {
    return ctx.throw(badRequest())
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound())
  }

  ctx.state.user = user

  return next()
}
