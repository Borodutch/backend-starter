import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'

const checkUser = async (ctx: Context, next: Next) => {
  const id: number = ctx.params.id

  if (id) {
    try {
      const { author } = await MessageModel.findById(id)

      if (author === ctx.state.user) {
        return next()
      } else {
        ctx.throw(403, 'Нежелательный доступ к чужому сообщению')
      }
    } catch (err) {
      ctx.throw(404, err.message)
    }
  }
}

export default checkUser
