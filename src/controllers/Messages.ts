import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Post, Put } from 'amala'
import { Msg } from '@/models/Message'

@Controller('/messages')
export default class CrudController {
  @Get('/')
  allMessages() {
    return Msg.find({})
  }

  @Post('/')
  createMessage(@Ctx() ctx: Context) {
    return Msg.create(ctx.request.body)
  }

  @Put('/:id')
  async updateMessage(@Ctx() ctx: Context) {
    await Msg.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body)
    return Msg.findOne({ _id: ctx.params.id })
  }

  @Delete('/:id')
  deleteMessage(@Ctx() ctx: Context) {
    return Msg.findByIdAndRemove({ _id: ctx.params.id })
  }
}
