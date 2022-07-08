import { Context, Next } from 'koa'
import { messageModel } from '@/models/messageModel'
import { notFound } from '@hapi/boom'

export default async function authorValidation(ctx: Context, next: Next) {
  const id = ctx.params.id
  const message = await messageModel.findById(id)
  if (!message || !message.author) {
    return ctx.throw(notFound())
  }
  const userId = ctx.state.user.id
  const authorMessage = message.author.toString()
  if (userId !== authorMessage) {
    return ctx.throw(notFound())
  }
  ctx.state.message = message
  return next()
}
