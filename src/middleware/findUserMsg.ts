import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function findUserMsg(ctx: Context, next: Next) {
  if (isValidObjectId(ctx.params.id)) {
    const msg = await MessageModel.findById(ctx.params.id)
    if (
      !msg ||
      // ctx.state.user._id.toString() != msg?.author?.toString()
      ctx.state.user.id != msg?.author
    ) {
      return ctx.throw(notFound("Can't find message with this id"))
    }
    ctx.state.msg = msg
    return next()
  } else {
    ctx.throw(badRequest('MessageId must be mongoose ObjectId type'))
  }
}
