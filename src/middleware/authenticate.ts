import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, notFound, unauthorized } from '@hapi/boom'
import { isString } from 'lodash'
import { verify } from '@/helpers/jwt'

export default async function authenticationUser(ctx: Context, next: Next) {
  const token = ctx.request.headers.token
  if (!isString(token)) {
    return ctx.throw(badRequest())
  }

  ctx.state.user = await UserModel.findOne({ token })

  if (!ctx.state.user) {
    return ctx.throw(notFound())
  }

  try {
    verify(token)
  } catch (err) {
    return ctx.throw(unauthorized())
  }

  return next()
}
