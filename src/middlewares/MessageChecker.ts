import { Context, Next } from 'koa'
import { MessageModel } from '@/models/MessageModel'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function MessageChecker(ctx: Context, next: Next) {
  const id = ctx.params.id

  if (!id) {
    return ctx.throw(notFound())
  }
  if (!isValidObjectId(id)) {
    return ctx.throw(badRequest('not valid id'))
  }
  const message = await MessageModel.findById(id)

  if (!message) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
