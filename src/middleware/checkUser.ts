import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'

export default async (ctx: Context, next: Next) => {
  const message = MessageModel.findById(ctx.params.id)
  const user = ctx.state.User

  if (!message.author._id) {
    return ctx.throw('Unauthorized')
  }

  if (message.author._id == user._id) {
    ctx.state.message = message
    return next()
  } else {
    return ctx.throw('404 Error')
  }
}
