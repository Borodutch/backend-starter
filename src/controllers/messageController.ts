import {
  createMessage,
  showAllMessages,
  findMessageById,
  deleteMessageById,
  updateMessage,
} from '@/models/messageModel'
import { Controller, Ctx, Get, Post, Delete, Flow, Params, Put } from 'amala'
import { Context } from 'koa'

@Controller('/messages')
class messageController {
  @Get('/')
  async messageList(@Ctx() ctx: Context) {
    return (ctx.body = showAllMessages())
  }
  @Post('/add')
  async messageAdd(@Ctx() ctx: Context) {
    const data: string = ctx.request.body
    createMessage(data)
  }
  @Get('/:id')
  async showSingleMessage(@Ctx() ctx: Context, @Params('id') id: string) {
    const messageId = ctx.params.id
    return (ctx.body = findMessageById(messageId))
  }
  @Delete('/:id')
  async deleteSingleMessage(@Ctx() ctx: Context, @Params('id') id: string) {
    const messageId = ctx.params.id
    deleteMessageById(messageId)
  }
  @Put('/:id')
  async updateSingleMessage(@Ctx() ctx: Context, @Params('id') id: any) {
    const messageId = ctx.params.id
    const data = ctx.request.body
    updateMessage(messageId, data)
  }
}
