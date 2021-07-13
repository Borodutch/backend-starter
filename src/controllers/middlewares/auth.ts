import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization
  if (!token) {
    return ctx.throw(400, 'token not found')
  }
  ctx.state.user = await verify(token)
  return next()
}
