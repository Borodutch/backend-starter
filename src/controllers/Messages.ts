import { Body, Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import { Message, Messages } from '@/models/Message'

@Controller('/messages')
export default class CrudController {
  @Get('/')
  allMessages() {
    return Message.find({})
  }

  @Post('/')
  createMessage(@Ctx() ctx: Context, @Body() text: Messages) {
    return Message.create(ctx.request.body)
  }

  @Put('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Body() text: Messages,
    @Params() _id: string
  ) {
    await Message.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body)
    return Message.findOne({ _id: ctx.params.id })
  }

  @Delete('/:id')
  deleteMessage(@Ctx() ctx: Context) {
    return Message.findByIdAndRemove({ _id: ctx.params.id })
  }
}
