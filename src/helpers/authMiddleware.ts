import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'
import { UserModel as User } from '@/models/user'

export async function authMiddleware(ctx: Context, next: Next) {
  const token = ctx.request.header.authorization
  const result = (await verify(token)) as { email: string }
  const { email } = result

  await User.findOne({ email }, function (err, foundedUser) {
    if (err) {
      throw Error(err)
    } else {
      ctx.state.user = foundedUser
    }
  })
  next()
}
