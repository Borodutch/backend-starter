import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { notFound } from '@hapi/boom'

const checkUser = async (ctx: Context, next: Next) => {
  const user = ctx.state.user
  const id = ctx.params.id
  const message = await MessageModel.findOne({ _id: id, user: user })

  if (!message) {
    return ctx.throw(notFound())
  }
  if (message.user !== user._id) {
    return ctx.throw(notFound())
  }
  ctx.state.message = message
  return next()
}

export default checkUser
