import { Context, Next } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/User'

export async function authenticate(ctx: Context, next: Next) {
  const token = ctx.headers.token as string

  try {
    const verifyToken = (await verify(token)) as {
      name: string
      email: string
    }

    ctx.state.user = await getOrCreateUser(verifyToken)
    return next()
  } catch (e) {
    return ctx.throw(401)
  }
}
