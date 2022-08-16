import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, notFound } from '@hapi/boom'
import { toString } from 'lodash'
import { verify } from '@/helpers/jwt'

export default async function authenticate(ctx: Context, next: Next) {
  const token = toString(ctx.request.headers.token)
  ctx.state.user = await UserModel.findOne({ token })
  if (!ctx.state.user) {
    return ctx.throw(notFound())
  }
  try {
    verify(token)
  } catch (error) {
    return ctx.throw(badRequest())
  }
  return next()
}
