import { Context, Next } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/User'

export async function authUser(ctx: Context, next: Next) {
  const token = ctx.headers.token as string
  if (token) {
    try {
      const verifyToken = (await verify(token)) as {
        name: string
        email: string
      }
      ctx.state.user = await getOrCreateUser(verifyToken)
      return next()
    } catch (error) {
      return ctx.throw(403, 'access_forbidden', { user: ctx.state.user })
    }
  }
  return ctx.throw(401, 'access_denied', { user: ctx.state.user })
}
