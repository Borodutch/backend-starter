import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { notFound } from '@hapi/boom'

export default async function emailMiddleware(ctx: Context, next: () => void) {
  const token = ctx.headers.token
  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(notFound())
  }
  ctx.state.user = user
  return next()
}
