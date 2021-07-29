import { User } from '@/models/user'
import { MessageModel } from '@/models/message'
import { isEqual } from 'lodash'
import { Context, Next } from 'koa'

export const authorCheck = async (ctx: Context, next: Next) => {
  const user = ctx.state.user
  const id = ctx.params.id
  const message = await MessageModel.findOne({ _id: id })
  if (!isEqual(message.author, user._id)) {
    ctx.throw(404)
  }
  return next()
}
