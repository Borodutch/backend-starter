import { verify } from '@/helpers/jwt'
import { UserModel } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { Context } from 'koa'

export default async function checkUser(ctx: Context, next: Function) {
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
