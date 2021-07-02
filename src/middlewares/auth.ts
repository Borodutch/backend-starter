import { Context } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/User'

export async function authenticate(ctx: Context, next) {
  const token = ctx.headers.token as string

  try {
    const veifyToken = (await verify(token)) as {
      name: string
      email: string
    }

    ctx.state.user = await getOrCreateUser({
      name: veifyToken.name,
      email: veifyToken.email,
    })
    return next()
  } catch (e) {
    return ctx.throw(401)
  }
}
