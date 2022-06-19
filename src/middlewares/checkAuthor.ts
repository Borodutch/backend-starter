import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { forbidden, notFound } from '@hapi/boom'

export default async function checkAuthor(ctx: Context, next: Next) {
  const messageId = ctx.params.id
  const message = await MessageModel.findById(messageId)
  if (!message) {
    throw notFound()
  }

  const user = ctx.state.user
  if (user.id !== message?.author?.toString()) {
    throw forbidden()
  } else {
    ctx.state.message = message
  }

  return next()
}
