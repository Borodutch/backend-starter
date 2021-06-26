import { MessageModel } from '@/models/message'
import { Context } from 'koa'

export async function isAuthor(ctx: Context, next: () => void | Promise<void>) {
  try {
    const user = ctx.state.user
    const id = ctx.params.id
    const message = await MessageModel.findById(id)
    if (message.author !== user.name) {
      return ctx.throw(403, 'You can not change others people messages')
    }
  } catch (error) {
    return ctx.throw(400, 'Something went wrong')
  }

  await next()
}
