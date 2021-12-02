import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { isEqual } from 'lodash'

const checkUser = async (ctx: Context, next: Next) => {
  const user = ctx.state.user
  const id = ctx.params.id
  const message = await MessageModel.findOne({ _id: id })

  if (!message) {
    return ctx.assert(user, 404, 'User not found. Please login!')
  }
  if (!isEqual(message.user, user._id)) {
    return ctx.assert(user, 404, 'User not found. Please login!')
  }
  ctx.state.message = message
  return next()
}

export default checkUser
