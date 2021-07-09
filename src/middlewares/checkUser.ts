import { messageModel } from '@/models/message'
import { ifError } from 'assert'
import { Context, Next } from 'koa'

export async function checkUser(ctx: Context, next: Next) {
  const message = await messageModel.findById(ctx.params.id as string)
  if (String(message?.user._id) === String(ctx.state.user.id)) {
    ctx.state.message = message
    return next()
  }
}
