import { Context, Next } from 'koa'
import { notFound } from '@hapi/boom'
import MessageModel from '@/models/Message'

export default async function (ctx: Context, next: Next) {
  const message = await MessageModel.findById(ctx.params.id)
  if (!message) return ctx.throw(notFound('message not found'))
  ctx.state.message = message

  const authorId = message?.author?.toString()
  const currentUserId = ctx.state.user.id

  if (currentUserId !== authorId) {
    return ctx.throw(notFound('message not found'))
  }
  return next()
}
