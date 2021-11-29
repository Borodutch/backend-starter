import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { forbidden, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async (ctx: Context, next: Next) => {
  const token = ctx.header.token as string

  try {
    await verify(token)
  } catch (err) {
    return ctx.throw(forbidden())
  }

  ctx.state.user = await UserModel.findOne({ token })

  if (!ctx.state.user) {
    return ctx.throw(notFound())
  }

  return next()
}
