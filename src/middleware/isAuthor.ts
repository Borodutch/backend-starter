import MessageModel from '@/models/Message'

export default async function isAuthor(ctx: any, next: Function) {
  const message = await MessageModel.findById(ctx.params.id)
  const authorId = message?.author?.toString()

  const currentUserId = ctx.state.user._id.toString()

  if (currentUserId !== authorId) {
    ctx.throw(403, 'Forbidden')
  } else {
    await next()
  }
}
