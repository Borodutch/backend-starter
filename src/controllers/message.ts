import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Post, Put, Flow } from 'amala'
import {
  getMessages,
  getMessageById,
  addMessage,
  updateMessageById,
  deleteMessageById,
} from '@/models/message'
import { auth } from '@/middleware/auth'

@Flow(auth)
@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getMessages(@Ctx() ctx: Context) {
    return getMessages(ctx.state.user)
  }

  @Get('/:id')
  async getMessage(@Ctx() ctx: Context) {
    return await getMessageById(ctx.state.user, ctx.params.id)
  }

  @Post('/')
  async createMessage(@Ctx() ctx: Context) {
    return addMessage(ctx.state.user, ctx.state.text)
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
