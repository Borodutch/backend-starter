import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async (ctx: Context, next: Next) => {
  const { token } = ctx.headers

  if (typeof token !== 'string') {
    return ctx.throw(forbidden())
  }

  const { id } = verify(token)
  if (!id) {
    return ctx.throw(forbidden())
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    return ctx.throw(forbidden())
  }

  ctx.state.user = user

  return next()
}
