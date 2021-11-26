import { Boom, forbidden } from '@hapi/boom'
import { Context, Next } from 'koa'
import { Message, MessageModel } from '@/models/message'
import { isDocument } from '@typegoose/typegoose'
import { isMongoId } from 'class-validator'
import { notFound } from '@hapi/boom'

const checkUser = async (ctx: Context, next: Next) => {
  const id: string = ctx.params.id

  if (!isMongoId(id)) {
    ctx.throw(notFound('invalid parameter name'))
  }

  try {
    const { author } = (await MessageModel.findById(id)
      .populate('author', '_id')
      .exec()) as Message

    if (isDocument(author)) {
      if (author._id.toString() === ctx.state.user._id.toString()) {
        return next()
      } else {
        ctx.throw(forbidden('access denied'))
      }
    }
  } catch (err) {
    if (err instanceof TypeError) {
      ctx.throw(notFound('message not found'))
    }

    if (err instanceof Boom) {
      ctx.throw(err)
    }
  }
}

export default checkUser
