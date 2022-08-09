import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export default async function (ctx: Context, next: () => Promise<void>) {
  const { token } = ctx.request.headers
  if (typeof token === 'string') {
    const { id } = verify(token)
    ctx.state.user = await UserModel.findById(id)
    return next()
  }
  return ctx.throw(400)
}
