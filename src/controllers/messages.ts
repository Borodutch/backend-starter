import { Context } from 'koa'
import { MessageModel, createMessage } from '../models/messages'
import { Controller, Post, Get, Put, Delete } from 'koa-router-ts'

@Controller('/messages')
export default class {
  @Post('/:userId')
  async postMessage(ctx: Context) {
    await createMessage(ctx.params.userId, ctx.request.body)
    ctx.status = 200
  }

  @Get('/')
  async getMessages(ctx: Context) {
    ctx.body = await MessageModel.find()
  }

  @Get('/:userId')
  async getMessagesFromUser(ctx: Context) {
    ctx.body = await MessageModel.find({ userId: ctx.params.userId })
  }

  @Put('/:id')
  async putMessage(ctx: Context) {
    await MessageModel.findOneAndUpdate(
      { _id: ctx.params.id },
      ctx.request.body
    )
    ctx.status = 200
  }

  @Delete('/:id')
  async deleteMessage(ctx: Context) {
    await MessageModel.findByIdAndDelete({ _id: ctx.params.id })
    ctx.status = 200
  }
}
