import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

export const userAuth = async (ctx: Context, next: Next) => {
  const user = await UserModel.findOne({ filter: ctx.headers.token })
  if (!user) {
    return ctx.throw(404, 'User not found')
  }
  ctx.state.user = user

  return next()
}
