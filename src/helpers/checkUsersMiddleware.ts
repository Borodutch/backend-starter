import { Context, Next } from 'koa'
import { MessageModel as Message } from '@/models/message'

export async function checkUsersMiddleware(ctx: Context, next: Next) {
  const user = ctx.state.user
  const id = ctx.params.id
  const message = await Message.findById(id)
  if (!(String(message.user) === String(user._id))) {
    return ctx.throw(404, 'Not Found')
  }
  ctx.state.message = message
  next()
}
