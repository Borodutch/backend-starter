import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Post, Put, Flow } from 'amala'
import {
  readMessages,
  readMessageById,
  createMessage,
  updateMessageById,
  deleteMessageById,
} from '@/models/message'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async readMessages(@Ctx() ctx: Context) {
    return readMessages(ctx.state.user)
  }

  @Get('/:id')
  async readMessageById(@Ctx() ctx: Context) {
    return await readMessageById(ctx.state.user, ctx.params.id)
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