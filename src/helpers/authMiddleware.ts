import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'
import { UserModel as User } from '@/models/user'

export async function authMiddleware(ctx: Context, next: Next) {
  const token = ctx.request.header.authorization
  const { email } = (await verify(token)) as { email: string }
  const user = await User.findOne({ email })

  if (!user) {
    return ctx.throw(401, 'unauthorized')
  }
  ctx.state.user = user
  next()
}
