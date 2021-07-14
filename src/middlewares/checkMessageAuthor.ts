import { MessageModel } from '@/models/message'
import { Context, Next } from 'koa'

export async function checkMessageAuthor(ctx: Context, next: Next) {
  const msgId = ctx.params.id
  const user = ctx.state.user
  const message = await MessageModel.findById(msgId)
  if (message.user['_id'] == user.id) {
    ctx.state.message = message
    return next()
  }
}
