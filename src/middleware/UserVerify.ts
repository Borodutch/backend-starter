import { Context, Next } from 'koa'
import { findOrCreateUser } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { verify } from '@/helpers/jwt'
import ValidUser from '@/validators/User'

export default async function UserVerify(ctx: Context, next: Next) {
  let currentUser = null
  let userId = null
  const token = ctx.header.token as string
  if (token) {
    try {
      userId = verify(token)['_id'] as string
    } catch {
      return ctx.throw(forbidden('Wrong token'))
    }
    currentUser = await findOrCreateUser({
      token,
    } as ValidUser)
    if (!currentUser || !(userId == currentUser['_id'].toString())) {
      return ctx.throw(forbidden('No user linked to this token'))
    }
  }
  ctx.state.user = currentUser
  return next()
}
