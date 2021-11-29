import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { forbidden } from '@hapi/boom'
import { isDocument } from '@typegoose/typegoose'
import { isMongoId } from 'class-validator'
import { notFound } from '@hapi/boom'

const checkUser = async (ctx: Context, next: Next) => {
  const id: string = ctx.params.id

  if (!isMongoId(id)) {
    return ctx.throw(notFound('invalid parameter name'))
  }

  const message = await MessageModel.findById(id).populate('author')

  if (!message) {
    return ctx.throw(notFound('message not found'))
  }

  if (!message?.author) {
    return ctx.throw(notFound('author not found'))
  }

  if (!isDocument(message?.author)) {
    return ctx.throw(notFound())
  }

  if (message?.author.id !== ctx.state.user.id) {
    return ctx.throw(forbidden('access denied'))
  }

  return next()
}

export default checkUser
