import { Body, Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/Message'
import ValidMessage from '@/validators/ValidMessage'

@Controller('/messages')
export default class MessagesController {
  @Get('/')
  allMessages() {
    return MessageModel.find({})
  }

  @Post('/')
  async createMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: ValidMessage
  ) {
    if (text) {
      await MessageModel.create(ctx.request.body)
    }
    return 'Message has been created'
  }

  @Put('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Body() { text }: ValidMessage,
    @Params() _id: string
  ) {
    if (text && _id) {
      await MessageModel.findByIdAndUpdate(
        { _id: ctx.params.id },
        ctx.request.body
      )
    }
    return 'Message has been updated'
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    await MessageModel.findByIdAndRemove({ _id: ctx.params.id })
    return 'Message has been deleted'
  }
}
