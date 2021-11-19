import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { verify } from '@/helpers/jwt'

export default async function userAuth(ctx: Context, next: Next) {
  const verification = await verify(ctx.headers.token as string)
  if (!verification) {
    return ctx.throw(404, 'Token is not valid')
  }

  const user = await UserModel.findOne({ filter: ctx.headers.token })
  if (!user) {
    return ctx.throw(404, 'User not found')
  }

  ctx.state.user = user

  return next()
}
