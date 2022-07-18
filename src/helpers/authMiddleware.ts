import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'

export default async function authMiddleware(ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    throw new Error('You are not authorized')
  }
  const user = await UserModel.findOne({ token })
  if (!user) {
    throw new Error('User not found')
  }
  ctx.state.user = user
  return next()
}
