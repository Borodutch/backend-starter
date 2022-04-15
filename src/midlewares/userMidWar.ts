import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export default async function authMidleware(ctx: Context, nxt: Next) {
  const token = ctx.headers.token
  if (!token) {
    return Error('Authentication failed')
  }

  if (typeof token !== 'string') {
    return Error('Authentication failed')
  }

  try {
    verify(token)
  } catch (err) {
    return Error('Authentication failed')
  }

  const user = await UserModel.findOne({ token })
  if (!user) {
    return Error('Authentication failed')
  }
  ctx.state.user = user
  return nxt()
}
