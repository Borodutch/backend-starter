import { readMessageById } from '@/models/message'
import { Context, Next } from 'koa'

export async function checkMessageAuthor(ctx: Context, next: Next) {
  const msgId = ctx.params.id as string
  const user = ctx.state.user
  if (
    (await readMessageById(msgId))._doc.user._id.toString() ===
    user._doc._id.toString()
  ) {
    return next()
  } else {
    ctx.throw(401)
  }
}
