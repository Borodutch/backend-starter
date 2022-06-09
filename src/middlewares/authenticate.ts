import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export async function authenticate(ctx: Context, next: Next) {
  try {
    const token = ctx.headers.token ? ctx.headers.token : undefined
    if (!token) {
      return ctx.throw(400, 'No token provided')
    }
    const user = await getUserFromToken(
      typeof token === 'object' ? token.join() : token
    )
    if (!user) {
      return ctx.throw(403, "User doesn't exist")
    }
    ctx.state.user = user
  } catch (err) {
    return ctx.throw(401, 'Auth error')
  }
  await next()
}

export async function getUserFromToken(token: string) {
  const payload = await verify(token)
  if (payload?.id === 'JsonWebTokenError') {
    throw new Error('Error user payload')
  }
  const user = await UserModel.findOne({ id: payload.id })

  return user
}
