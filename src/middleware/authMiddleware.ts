import { verify } from '@/helpers/jwt'
import { UserModel } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { Context } from 'koa'

export default async function checkUser(ctx: Context, next: Function) {
  const token = ctx.headers.token

  if (!(typeof token === 'string')) {
    ctx.throw(forbidden())
  }

  const { id } = verify(token)
  if (!id) {
    ctx.throw(forbidden())
  }

  const user = await UserModel.findById(id)

  if (!user) {
    ctx.throw(forbidden())
  }

  ctx.state.user = user

  return next()
}
