import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export default async function UserVerificator(ctx: Context, next: any) {
  const token = ctx.header.token
  if (token) {
    const result = verify(token.toString())
    if (result) {
      const user = await UserModel.findOne({ _id: result.id })
      ctx.state.user = user
    }
  }
  await next()
}
