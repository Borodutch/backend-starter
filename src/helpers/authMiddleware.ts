import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'
import { UserModel as User } from '@/models/user'

export async function authMiddleware(ctx: Context, next: Next) {
  const token = ctx.request.header.authorization
  const result = (await verify(token)) as { email: string }
  const { email } = result
  const foundedUser = await User.findOne({ email })

  if (foundedUser && Object.keys(foundedUser).length) {
    ctx.state.user = foundedUser
  } else {
    return ctx.throw(401, 'unauthorized')
  }
  next()
}
