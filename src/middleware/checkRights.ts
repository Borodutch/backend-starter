import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'

export const checkRights = async (ctx: Context, next: Next) => {
  const message = await MessageModel.findOne({
    _id: ctx.params.id,
  })
  if (!message) {
    ctx.response.status = 404
    return ctx.throw
  }

  if (ctx.state.user._id.toString() !== message.author.toString()) {
    ctx.response.status = 401
    return ctx.throw
  }
  ctx.state.message = message
  await next()
}
