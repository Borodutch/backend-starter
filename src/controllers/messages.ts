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
import { checkMessageAuthor } from '@/middlewares/checkMessageAuthor'
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

  @Flow(checkMessageAuthor)
  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    return await readMessageById(id)
  }

  @Flow(checkMessageAuthor)
  @Get('/:id')
  async getMessagesByUser(@CurrentUser() user: User) {
    return await readMessagesByUser(user)
  }

  @Flow(checkMessageAuthor)
  @Post('/:id')
  async updateMessage(@Params('id') id: string, @Body('text') text: string) {
    return await updateMessageById(id, text)
  }

  @Flow(checkMessageAuthor)
  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    return await deleteMessageById(id)
  }
}
