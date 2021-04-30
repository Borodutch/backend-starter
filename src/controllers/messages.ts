import { Context } from 'koa'
import {
  Controller,
  Ctx,
  Post,
  Get,
  Put,
  Delete,
  Flow,
} from 'koa-ts-controllers'
import {
  addMessage,
  deleteMessage,
  updateMessage,
  getMessages,
  getMessage,
} from '@/models/message'
import { authMiddleware } from '@/middlewares/authMiddleware'

@Controller('/messages')
export default class MessagesController {
  @Get('/')
  @Flow(authMiddleware)
  async getMessages(@Ctx() ctx: Context) {
    const data = ctx.request.body
    return getMessages(data.userId)
  }

  @Get('/:id')
  @Flow(authMiddleware)
  async getMessage(@Ctx() ctx: Context) {
    const data = ctx.request.body
    return getMessage(data.userId, ctx.params.id)
  }

  @Post('/')
  @Flow(authMiddleware)
  async addMessage(@Ctx() ctx: Context) {
    const data = ctx.request.body
    return addMessage(data.userId, data.message)
  }

  @Put('/')
  @Flow(authMiddleware)
  async updateMessage(@Ctx() ctx: Context) {
    const data = ctx.request.body
    return updateMessage(data.id, data.userId, data.message)
  }

  @Delete('/:id')
  @Flow(authMiddleware)
  async deleteMessage(@Ctx() ctx: Context) {
    const data = ctx.request.body
    return deleteMessage(data.userId, ctx.params.id)
  }
}
