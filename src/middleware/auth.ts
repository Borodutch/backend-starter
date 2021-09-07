import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization.split(' ')[1]
  if (!token) {
    ctx.throw(401, 'Token is undefined')
  }
  ctx.state.user = await UserModel.findOne({ token })
  if (ctx.state.user === null) {
    return (ctx.response.status = 401)
  }

  await next()
}
