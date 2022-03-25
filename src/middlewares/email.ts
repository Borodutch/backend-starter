import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function emailMiddleware(ctx: Context, next: Function) {
  const token = ctx.headers.token as string
  const _token = verify(token)
  if (!_token) {
    return ctx.throw(badRequest())
  } else {
    const user = await UserModel.findOne({ token })
    if (!user) {
      return ctx.throw(notFound())
    }
    ctx.state.user = user
    return next()
  }
}
