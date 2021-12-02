import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.token
  const user = await UserModel.findOne({ token })

  if (!user) {
    return ctx.assert(user, 404, 'User not found. Please login!')
  }
  ctx.state.user = user
  return next()
}

export default auth
