import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async (ctx: Context, next: Next) => {
  try {
    const token = ctx.header.token as string
    await verify(token)
    ctx.state.user = await UserModel.findOne({ token })
    return next()
  } catch (err) {
    ctx.throw(unauthorized())
  }
}
