import { verify } from '@/helpers/jwt'
import { MessageModel } from '@/models/Messages'
import { UserModel } from '@/models/User'
import { forbidden, notFound } from '@hapi/boom'
import { Context } from 'koa'
import { Types } from 'mongoose'

export async function checkUser(ctx: Context, next: Function) {
  ctx.state.user = null
  const token = ctx.headers.token

  if (typeof token === 'string') {
    const { id } = verify(token)
    if (id) {
      ctx.state.user = await UserModel.findById(id)
    }
  }

  if (ctx.state.user) {
    await next()
  } else {
    ctx.throw(forbidden())
  }
}

export async function checkMessage(ctx: Context, next: Function) {
  const { user } = ctx.state
  const { messageId } = ctx.params

  if (!Types.ObjectId.isValid(messageId))
    ctx.throw(notFound('Message not found'))

  if (user && messageId) {
    ctx.state.message = await MessageModel.findOne({ _id: messageId, user })
  } else {
    ctx.state.message = null
  }

  if (ctx.state.message) {
    await next()
  } else {
    ctx.throw(notFound('Message not found'))
  }
}
