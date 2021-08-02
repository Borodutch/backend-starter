import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Post, Put,} from 'amala'
import {
  readMessages,
  createMessage,
  updateMessageById,
  deleteMessageById,
} from '@/models/message'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async readMessages(@Ctx() ctx: Context) {
    return readMessages(ctx.state.user, ctx.state.text)
  }

  @Post('/')
  async createMessage(@Ctx() ctx: Context) {
    return createMessage(ctx.state.user, ctx.state.text)
  }

  @Put('/')
  async updateMessage(@Ctx() ctx: Context) {
    return updateMessageById(ctx.state.user, ctx.state.id, ctx.state.text)
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    return await deleteMessageById(ctx.state.user, ctx.params.id)
  }
}
