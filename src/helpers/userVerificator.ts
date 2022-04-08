import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function userVerificator(ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    throw notFound()
  }
  verify(token.toString())
  const user = await UserModel.findOne({ token })
  if (!user) {
    throw notFound()
  }
  ctx.state.user = user
  await next()
}
