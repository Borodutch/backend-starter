import {
  Controller,
  Post,
  Get,
  Params,
  Delete,
  Body,
  Flow,
  CurrentUser,
  Ctx,
} from 'amala'
import {
  createMessage,
  readMessageById,
  readMessagesByUser,
  updateMessageById,
  deleteMessageById,
} from '@/models/message'
import { authenticate } from '@/middlewares/auth'
import { compareUsersMessage } from '@/middlewares/compareUsers'
import { User } from '@/models/user'
import { Context } from 'koa'

@Flow(authenticate)
@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body('text') text: string,
    @Ctx() ctx: Context,
    @CurrentUser() user: User
  ) {
    try {
      await createMessage(user, text)
    } catch (e) {
      ctx.throw(400)
    }
  }

  @Get('/:id')
  async getMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User
  ) {
    if (await compareUsersMessage(ctx, id, user)) {
      return await readMessageById(id)
    }
  }

  @Get('/:id')
  async getMessagesByUser(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User
  ) {
    if (await compareUsersMessage(ctx, id, user)) {
      return await readMessagesByUser(user)
    }
  }

  @Post('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User,
    @Body('text') text: string
  ) {
    if (await compareUsersMessage(ctx, id, user)) {
      return await updateMessageById(id, text)
    }
  }

  @Delete('/:id')
  async deleteMessage(
    @Ctx() ctx: Context,
    @CurrentUser() user: User,
    @Params('id') id: string
  ) {
    if (await compareUsersMessage(ctx, id, user)) {
      return await deleteMessageById(id)
    }
  }
}
