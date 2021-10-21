import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async (ctx: Context, next: Next) => {
  const token = ctx.header.token as string

  if (!token) return ctx.throw(notFound())

  await verify(token)
  ctx.state.user = await UserModel.findOne({ token })

  if (!ctx.state.user) return ctx.throw(unauthorized())

  return next()
}
