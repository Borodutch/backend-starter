import { MessageModel } from '@/models/message'
import { Context, Next } from 'koa'
import { isEqual } from 'lodash'

export const authorCheck = async (ctx: Context, next: Next) => {
  const user = ctx.state.user
  const message = await MessageModel.findById(ctx.params.id)
  if (message) {
    if (isEqual(message.author, user._id)) {
      ctx.state.message = message
      return next()
    }
  }
  ctx.throw(404, 'Message not found')
}
