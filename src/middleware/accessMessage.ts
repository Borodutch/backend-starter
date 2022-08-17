import { Boom, notFound } from '@hapi/boom'
import { Context } from 'koa'
import MessageModel from '@/models/Message'

export default async function (ctx: Context, next: () => Promise<null>) {
  const message = await MessageModel.findById(ctx.params.id)
  const authorId = message?.author?.toString()

  const currentUserId = ctx.state.user.id

  if (currentUserId !== authorId) {
    return ctx.throw(new Boom(notFound('Page not found')))
  }
  return next()
}
