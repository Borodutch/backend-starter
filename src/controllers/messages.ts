import { Context } from 'koa'
import { Controller, Post, Get, Params, Delete, Ctx, Flow } from 'amala'
import {
  createMessage,
  readMessageById,
  readMessagesByUser,
  updateMessageById,
  deleteMessageById,
} from '@/models/message'
import { authenticate } from '@/middlewares/auth'

@Flow(authenticate)
@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(@Ctx() ctx: Context) {
    await createMessage(ctx.state.user, ctx.context.body)
  }

  @Get('/:id')
  async getMessage(@Params('id') messageId: string) {
    return await readMessageById(messageId)
  }
  @Get('/:id')
  async getMessagesByUser(@Ctx() ctx: Context) {
    return await readMessagesByUser(ctx.state.user)
  }

  @Post('/:id')
  async updateMessage(@Ctx() ctx: Context) {
    return await updateMessageById(
      ctx.state.user,
      ctx.params.messageId,
      ctx.context.body
    )
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    return await deleteMessageById(ctx.state.user, ctx.params.messageId)
  }
}
