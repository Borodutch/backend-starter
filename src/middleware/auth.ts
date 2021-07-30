import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

export const authVerify = async (ctx: Context, next: Next) => {
  const user = await UserModel.findOne({ token: ctx.headers.token })
  if (!user) {
    return ctx.throw(404, 'no user found')
  }
  ctx.state.user = user
  return next()
}
