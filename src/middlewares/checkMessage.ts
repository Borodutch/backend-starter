import { MessageModel } from '@/models/message'
import { Context, Next } from 'koa'

export const checkMessage = async (ctx: Context, next: Next) => {
  const message = await MessageModel.findOne({
    _id: ctx.params.id,
    author: ctx.state.user,
  })

  if (message) {
    ctx.state.message = message
  } else {
    return ctx.throw(404, 'message not found')
  }
  return next()
}
