import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { badRequest, forbidden } from '@hapi/boom'

export default async function attachUser(ctx: Context, next: Next) {
  if (!ctx.header.token) {
    return ctx.throw(badRequest('You need to provide user token'))
  }
  const user = await UserModel.findOne({ token: ctx.header.token })
  if (!user) {
    return ctx.throw(forbidden("User with this token doesn't exist"))
  }
  ctx.state.user = user
  return await next()
}
