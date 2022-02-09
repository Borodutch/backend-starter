import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notFound } from '@hapi/boom'

export default async function checkAuthor(ctx: Context, next: Next) {
  try {
    const message = await MessageModel.findById(ctx.params.id)
    const user = ctx.state.user
    if (message?.author?.toString() === user.id) {
      ctx.state.message = message
      return next()
    }
  } catch {
    return ctx.throw(notFound())
  }
}
