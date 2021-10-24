import { Context, Next } from 'koa'
import { MessageModel } from '@/models/messages'

export async function checkUser(ctx: Context, next: Next) {
  const messageId = ctx.params.id

  const user = ctx.state.user

  const message = await MessageModel.findById(messageId)

  if (!message.author._id) {
    return ctx.throw('Unauthorized')
  }

  if (message.author._id == user.id) {
    ctx.state.message = message

    return next()
  } else {
    return ctx.throw('404 Error')
  }
}
