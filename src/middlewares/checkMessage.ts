import { Context, Next } from 'koa'
import { MessageModel } from '@/models/MessageModel'
import { notFound } from '@hapi/boom'

export default async function (ctx: Context, next: Next) {
  const message = await MessageModel.findById(ctx.params.id)
  if (!message) return ctx.throw(notFound('message not found'))
  ctx.state.message = message

  const authorId = message.messageAuthor?.toString()
  const currentUser = ctx.state.user.id

  if (currentUser !== authorId) {
    return ctx.throw(notFound('message not found'))
  }

  return next()
}
