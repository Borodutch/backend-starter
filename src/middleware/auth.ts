import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization.split(' ')[1]
  if (!token) {
    ctx.response.status = 401
    return ctx.throw(401, 'User unauthorized ')
  }
  ctx.state.user = await UserModel.findOne({ token })
  if (!ctx.state.user) {
    ctx.response.status = 401
    return ctx.throw(401, 'User unauthorized ')
  }

  return next()
}
