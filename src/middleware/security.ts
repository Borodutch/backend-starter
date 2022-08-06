import { Context } from 'koa'
import MessageModel from '@/models/Message'

export default async function (ctx: Context, next: () => Promise<any>) {
  const message = await MessageModel.findById(ctx.params.id)
  const authorId = message?.author?.toString()

  const currentUserId = ctx.state.user.id

  if (currentUserId !== authorId) {
    return ctx.throw(404, 'page not found')
  } else {
    return next()
  }
}
