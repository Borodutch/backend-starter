import { getOrCreateUser, User } from '@/models/user'
import { verify } from '@/helpers/jwt'
import { Context } from 'koa'

export async function authMiddleware(ctx: Context, next) {
  const token = ctx.headers['authorization']

  if (!token) {
    return ctx.throw(401, "You're not logged in")
  }
  try {
    const payload = (await verify(token)) as User

    const { name, email, facebookId, telegramId } = payload

    ctx.state.user = await getOrCreateUser({
      name,
      email,
      facebookId,
      telegramId,
    })

    return next()
  } catch (err) {
    return ctx.throw(err)
  }
}
