import { Context, Next } from 'koa'
import { MsgModel } from '@/models/MsgModel'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function getMsgById(ctx: Context, next: Next) {
  const id = ctx.params.id
  //   console.log(id)

  if (!id) {
    return ctx.throw(notFound())
  }
  if (!isValidObjectId(id)) {
    return ctx.throw(badRequest('not valid id'))
  }
  const message = await MsgModel.findById(id)

  if (!message) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
