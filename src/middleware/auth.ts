import { Context } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/user'

export async function auth(ctx: Context, next) {
  try {
    const payload = await verify(ctx.headers.token as string)
    ctx.state.user = await getOrCreateUser({
      name: payload['name'],
      email: payload['email'],
    })
    return next()
  } catch (e) {
    return ctx.throw(401)
  }
}
