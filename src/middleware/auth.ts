import { UserModel } from '@/models/user'
import { verify } from '@/helpers/jwt'
import { Context, Next } from 'koa'

export default async (ctx: Context, next: Next) => {
  try {
    const token = ctx.header.token as string
    await verify(token)
    ctx.state.user = await UserModel.findOne({ token })
    return next()
  } catch (err) {
    console.log(err)
    ctx.status = 401
    ctx.body = { error: 'Unauthorized' }
  }
}
