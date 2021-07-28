import { UserModel } from '@/models/user'
import { Context } from 'koa'

export async function userAuth(ctx: Context, next: () => Promise<any>) {
  const user = await UserModel.findOne({
    token: ctx.request.headers.accesstoken,
  })
  if (user) {
    ctx.state.user = user
    return next()
  }
  ctx.throw(401)
}
