import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { Types } from 'mongoose'
import { badData, notFound } from '@hapi/boom'
import { isRefType } from '@typegoose/typegoose'

export default async (ctx: Context, next: Next) => {
  const message = await MessageModel.findById(ctx.params.id)
  if (!message) {
    return ctx.throw(notFound())
  }

  const user = ctx.state.user
  if (!isRefType(message.author, Types.ObjectId)) {
    return ctx.throw(badData())
  }

  if (message.author.toString() != user.id) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message
  return next()
}
