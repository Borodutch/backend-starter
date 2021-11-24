import { Context, Next } from 'koa'
import { Message, MessageModel } from '@/models/message'

const checkUser = async (ctx: Context, next: Next) => {
  const id: number = ctx.params.id

  if (id) {
    try {
      const { author } = (await MessageModel.findById(id)) as Message
      if (author === ctx.state.user.name) {
        return next()
      } else {
        ctx.status = 403
        ctx.body = {
          message: 'access denied',
        }
      }
    } catch (err) {
      ctx.status = 404
      ctx.body = {
        message: 'message not found',
      }
    }
  }
}

export default checkUser
