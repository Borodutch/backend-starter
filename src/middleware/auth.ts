import { UserModel as User } from '@/models/user'

export async function userAuth(ctx, next) {
  const user = await User.findOne({
    token: ctx.request.header.accesstoken,
  }).exec()
  if (user) {
    ctx.state.user = user
    return next()
  }
  ctx.response.status = 401
}
