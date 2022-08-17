import { Boom, badRequest, notFound } from '@hapi/boom'
import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export default async function (ctx: Context, next: () => Promise<null>) {
  const { token } = ctx.request.headers
  if (typeof token !== 'string') {
    return ctx.throw(new Boom(badRequest('invalid token')))
  }
  const { id } = verify(token)
  const user = await UserModel.findById(id)
  if (!user) ctx.throw(new Boom(notFound('User not found')))
  ctx.state = { user }

  return next()
}
