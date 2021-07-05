import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization
  if (!token) {
    return ctx.throw(400, 'token not found')
  }
  try {
    ctx.state.user = await verify(token)
    return next()
  } catch {
    ctx.throw(401, 'Token is not valid')
  }
}
