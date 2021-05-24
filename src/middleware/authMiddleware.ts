import { verify } from '@/helpers/jwt'
import { Context } from 'koa'
import { UserModel } from '../models/user'

export default async (ctx: Context, next) => {
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
