import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { forbidden } from '@hapi/boom'
import { toString } from 'lodash'

export default async function check(ctx: Context, next: Next) {
  const Message = await MessageModel.findById(ctx.params.id)
  if (toString(ctx.state.user._id) === toString(Message?.author)) {
    return next()
  } else {
    return ctx.throw(forbidden())
  }
}
