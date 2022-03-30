import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export default async function verifyToken(ctx: Context, next: Next) {
  const token = (await ctx.header.token) as string

  const user = await UserModel.findOne({ token })

  if (token) {
    verify(token)
    ctx.state.user = user
    return next()
  } else {
    ctx.throw(400, 'User not found')
  }
}
