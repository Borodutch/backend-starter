import { verify } from '@/helpers/jwt'
import { Context } from 'koa'
import { User, getOrCreateUser } from '@/models/user'

export async function requireAuth(
  ctx: Context,
  next: () => void | Promise<void>
) {
  try {
    const token = ctx.cookies.get('authToken')
    const data = (await verify(token)) as User
    const { name, email, facebookId, telegramId } = data

    ctx.state.user = await getOrCreateUser({
      name,
      email,
      facebookId,
      telegramId,
    })

    return next()
  } catch (error) {
    return ctx.throw(401, 'Unauthorized')
  }
}
