import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'

export const authVerify = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('jwt')
  if (!token) {
    return ctx.throw(400, 'Please sign Up')
  }
  ctx.state.user = await verify(token)
  console.log(ctx.state.user)
  return await next()
}