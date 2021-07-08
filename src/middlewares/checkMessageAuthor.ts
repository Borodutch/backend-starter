import { readMessageById } from '@/models/message'
import { Context, Next } from 'koa'

export async function checkMessageAuthor(ctx: Context, next: Next) {
  const msgId = ctx.params.id as string
  const user = ctx.state.user
  try {
    if (
      (await readMessageById(msgId)).toObject().user._id.toString() === user.id
    ) {
      ctx.state.message = await readMessageById(msgId)
      return next()
    }
  } catch (e) {
    ctx.throw(404)
  }
}
