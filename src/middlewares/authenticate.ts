import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, forbidden, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export async function authenticate(ctx: Context, next: Next) {
  try {
    const token = ctx.headers.token
    if (!token) {
      return ctx.throw(badRequest('No token provided'))
    }
    if (typeof token !== 'string') {
      return ctx.throw(badRequest('Bad token'))
    }
    const user = await getUserFromToken(token)
    if (!user) {
      return ctx.throw(forbidden('Auth failed'))
    }
    ctx.state.user = user
  } catch (err) {
    return ctx.throw(unauthorized())
  }
  return next()
}

export async function getUserFromToken(token: string) {
  const payload = await verify(token)
  if (payload?.id === 'JsonWebTokenError') {
    throw new Error('Error user payload')
  }
  const user = await UserModel.findById(payload.id)

  return user
}
