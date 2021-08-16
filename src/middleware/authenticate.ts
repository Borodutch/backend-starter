import { UserModel } from '@/models/user'
import { Context, Next } from 'koa'

export const userAuth = async (ctx: Context, next: Next) => {
  const user = await UserModel.findOne({ token: ctx.headers.token })
  if (!user) {
    return ctx.throw(404, 'User not found')
  }
  ctx.state.user = user

  return next()
}