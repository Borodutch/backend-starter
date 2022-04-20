import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function authorizationMidleware(ctx: Context, nxt: Next) {
  const userToken = ctx.headers.token
  if (!userToken) {
    return ctx.throw(badRequest())
  }

  if (typeof userToken !== 'string') {
    return ctx.throw(badRequest())
  }

  try {
    verify(userToken)
  } catch (err) {
    return ctx.throw(badRequest())
  }

  const user = await UserModel.findOne({ userToken })
  if (!user) {
    return ctx.throw(notFound())
  }
  ctx.state.user = user
  return nxt()
}
