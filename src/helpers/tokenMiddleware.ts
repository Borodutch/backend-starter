import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function tokenMiddleware(ctx: Context, next: Next) {
  const token = ctx.header.token as string
  if (!token) {
    return ctx.throw(forbidden('Token not found'))
  }
  const decoded = verify(token)
  const user = await UserModel.findById(decoded.id)
  if (!user) {
    return ctx.throw(forbidden('User does not exist'))
  }
  ctx.state.user = user
  ctx.state.user.id = user.id
  await next()
}
