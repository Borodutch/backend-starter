import { Controller, Get, Post, Delete, Path } from 'koa-router-ts'
import { Context } from 'koa'
import { UserModel } from '@models/user'
import { MessageModel } from '@models/message'

@Controller('/messages')
export default class {
  @Get('/')
  async getMessages (ctx: Context) {
    let { user } = await getUserAndMessage(ctx.request.body.id)
    user.populate('messages')
    await user.execPopulate()
    ctx.body = user
  }
  @Post('/')
  async addMessage (ctx: Context) {
    const message = new MessageModel({ msg: ctx.request.body.message })
    let { user } = await getUserAndMessage(ctx.request.body.id)
    user.messages.push(message._id)
    await message.save()
    await user.save()
    ctx.body = message
  }
  @Delete('/:id')
  async deleteMessage (ctx: Context) {
    let { user, message } = await getUserAndMessage(ctx.request.body.id, ctx.request.body.idMessage)
    const pos = user.messages.indexOf(message._id)
    user.messages.splice(pos, 1)
    await user.save()
    await MessageModel.remove({_id: message._id}) 
    ctx.body = user
  }
  @Path('/:id')
  async updateMessage (ctx: Context) {
    let { user, message } = await getUserAndMessage(ctx.request.body.id, ctx.request.body.idMessage)
    console.log(user, message)
    if (user.messages.indexOf(message._id) == -1) {
      throw new Error('No message for this user')
    }
    message.msg = ctx.request.body.newMessage
    await message.save()
    ctx.body = message
  }
}

async function getUserAndMessage (userId: string, messageId?: string) {
  const user = await UserModel.findOne({ _id: userId })
  let message
  if (!user) {
    throw new Error('Can\'t find the user')
  }
  if (messageId) {
    message = await MessageModel.findOne({ _id: messageId})
    if (!message) {
      throw new Error('No message for this user')
    }
  }
  return { user, message }
}
