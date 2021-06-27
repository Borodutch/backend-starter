import { MessageModel } from '@/models/message'
import * as jwt from 'jsonwebtoken'
import { Context, Next } from 'koa'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers['Authorization']
  if (!token) {
    ctx.throw(400, 'token not found')
  }
  const decoded = jwt.verify(token as string, process.env.JWT)
  const user = await MessageModel.findOne({ decoded })
  if (!user) {
    ctx.throw(400, 'user not found')
  }
  ctx.state.user = user
  return next()
}
