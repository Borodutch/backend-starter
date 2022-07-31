import { UserModel } from '@/models/User'

export default async function auth(ctx: any, next: Function) {
  ctx.state.user = await UserModel.findOne({
    token: ctx.request.header.token,
  })
  await next()
}
