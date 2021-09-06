import { Context, Next } from 'koa'
import { verify } from '@/helpers/jwt'
import { UserModel } from '@/models/user'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization.split(' ')[1]
  if (!token) {
    ctx.throw(404, 'Token is undefined')
  }
  ctx.state.user = await UserModel.findOne({ token })
  return await next()
}
