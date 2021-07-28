import { Context, Next } from 'koa'
import { User, UserModel } from '@/models/user'
import { Ref } from '@typegoose/typegoose'

export const authVerify = async (ctx: Context, next: Next) => {
  const user: Ref<User> = await UserModel.findOne({ token: ctx.headers.token })
  if (!user) {
    return ctx.throw(401, 'Please sign Up')
  }
  ctx.state.user = user
  return next()
}
