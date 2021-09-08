import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'

export const checkRights = async (ctx: Context, next: Next) => {
  const message = await MessageModel.findOne({
    _id: ctx.params.id,
  })
  if (!message) {
    ctx.response.status = 404
    return ctx.throw(401, 'User unauthorized ')
  }

  if (ctx.state.user._id.toString() !== message.author.toString()) {
    ctx.response.status = 401
    return ctx.throw(401, 'User unauthorized ')
  }
  ctx.state.message = message
  return next()
}
