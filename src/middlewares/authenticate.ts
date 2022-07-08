import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { forbidden, notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function authenticate(ctx: Context, next: Next) {
  const token = ctx.header.token
  if (!token) {
    throw unauthorized()
  }
  try {
    verify(token.toString())
  } catch {
    throw forbidden()
  }
  const user = await UserModel.findOne({ token })

  if (!user) {
    throw notFound()
  }
  ctx.state.user = user
  return next()
}
