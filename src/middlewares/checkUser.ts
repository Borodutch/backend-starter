import { MessageModel } from '@/models/message'
import { Context, Next } from 'koa'

export async function checkUser(ctx: Context, next: Next) {
  const messageId = ctx.params.id

  const user = ctx.state.user

  const message = await MessageModel.findById(messageId)

  if (message.user._id == user.id) {
    ctx.state.message = message
    return next()
  } else {
    return ctx.throw('you cannot change others messages')
  }
}
