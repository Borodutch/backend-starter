import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

export async function authentication(ctx: Context, next: Next) {
  const token = ctx.headers.token as string
  if (token) {
    ctx.state.user = await UserModel.findOne({ token })
    return next()
  }
  if (!token) {
    return ctx.throw(404, 'token not found')
  }
}
