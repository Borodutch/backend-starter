import {
  Controller,
  Post,
  Get,
  Params,
  Delete,
  Body,
  Flow,
  CurrentUser,
} from 'amala'
import {
  createMessage,
  readMessageById,
  readMessagesByUser,
  updateMessageById,
  deleteMessageById,
  Message,
} from '@/models/message'
import { authenticate } from '@/middlewares/auth'
import { User } from '@/models/user'
import { Context } from 'koa'

@Flow(authenticate)
@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(
    ctx: Context,
    @CurrentUser() user: User,
    @Body() body: { text: Message }
  ) {
    try {
      await createMessage(user, body.text)
    } catch (e) {
      ctx.throw(400)
    }
  }

  @Get('/:id')
  async getMessage(ctx: Context, @Params('id') messageId: string) {
    try {
      return await readMessageById(messageId)
    } catch (e) {
      ctx.throw(400)
    }
  }

  @Get('/:id')
  async getMessagesByUser(ctx: Context, @CurrentUser() user: User) {
    try {
      return await readMessagesByUser(user)
    } catch (e) {
      ctx.throw(400)
    }
  }

  @Post('/:id')
  async updateMessage(
    ctx: Context,
    @Params() id: { id: string },
    @CurrentUser() user: User,
    @Body() text: object
  ) {
    try {
      return await updateMessageById(id.id, user, text)
    } catch (e) {
      ctx.throw(400)
    }
  }

  @Delete('/:id')
  async deleteMessage(
    ctx: Context,
    @CurrentUser() user: User,
    @Params() id: { id: string }
  ) {
    try {
      return await deleteMessageById(user, id.id)
    } catch (e) {
      ctx.throw(400)
    }
  }
}
