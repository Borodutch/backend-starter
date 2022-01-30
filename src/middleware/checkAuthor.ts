import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notFound } from '@hapi/boom'

export default async function checkAuthor(ctx: Context, next: Next) {
  const message = await MessageModel.findById(ctx.params.id)
  const user = ctx.state.user
  if (message && message.author == user.id) {
    return next()
  }
  return ctx.throw(notFound())
}
