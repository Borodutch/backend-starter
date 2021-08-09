import { Context, Next } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/user'

export async function authentication(ctx: Context, next: Next) {
  const token = ctx.headers.token as string
  if (token) {
    try {
      const verifyToken = (await verify(token)) as {
        name: string
        email: string
      }
      ctx.state.user = await getOrCreateUser(verifyToken)
      return next()
    } catch (err) {
      return ctx.throw(401)
    }
  }
}
