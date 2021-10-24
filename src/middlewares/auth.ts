import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

export async function authentication(ctx: Context, next: Next) {
  const token = ctx.headers.token as string

  if (!token) {
    return ctx.throw(404, 'token not found')
  }

  ctx.state.user = await UserModel.findOne({ token })

  if (!ctx.state.user) {
    return ctx.throw(401, 'User unauthorized ')
  }

  return next()
}
