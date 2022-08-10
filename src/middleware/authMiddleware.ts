import { Context, Next } from 'koa'
import { User, UserModel } from '@/models/User'
import { toString } from 'lodash'
import { verify } from '@/helpers/jwt'

export default async function authMiddleware(
  ctx: Context,
  next: Next
): Promise<User> {
  const token = toString(ctx.req.headers.token)
  verify(token)
  ctx.state.user = await UserModel.findOne({ token })
  return next()
}
