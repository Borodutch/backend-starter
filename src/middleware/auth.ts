import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'

export default async function (ctx: Context, next: Next) {
  const user = await UserModel.findOne({ token: ctx.headers.token })
  if (!user) throw new Error('User not found')
  ctx.state.user = user
  return next()
}
