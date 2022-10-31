import { Context, Next } from 'koa'
import { MessagesModel } from '@/models/MessagesModel'
import { notFound } from '@hapi/boom'

export default async function (ctx: Context, next: Next) {
  const message = await MessagesModel.findById(ctx.params.id)
  if (!message) {
    return ctx.throw(notFound('message not found'))
  }
  ctx.state.message = message

  const authorId = message.author?.toString()
  const currentUserId = ctx.state.user.id

  if (currentUserId !== authorId) {
    return ctx.throw(notFound('message not found'))
  }
  return next()
}
