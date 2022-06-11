import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { UserModel } from '@/models/User'
import { badRequest, forbidden, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export async function getMessage(ctx: Context, next: Next) {
  const id = ctx.params.id

  if (!id) {
    return ctx.throw(notFound)
  }

  if (!isValidObjectId(id)) {
    return ctx.throw(badRequest('id is not valid'))
  }

  const message = await MessageModel.findById(id)
  if (!message) {
    return ctx.throw(notFound)
  }

  ctx.state.message = message

  return next()
}

export async function checkAuthor(ctx: Context, next: Next) {
  const author = await UserModel.findById(ctx.state.message.author)

  if (author?._id.toString() !== ctx.state.user._id.toString()) {
    return ctx.throw(forbidden)
  }

  return next()
}
