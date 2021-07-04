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
    @Ctx() ctx: Context,
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
  async getMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: { id: string },
    @CurrentUser() user: User
  ) {
    if (
      (await readMessageById(messageId.id))._doc.user._id.toString() ==
      user._doc._id.toString()
    ) {
      return await readMessageById(messageId.id)
    } else {
      ctx.throw(400)
    }
  }

  @Get('/:id')
  async getMessagesByUser(
    @Ctx() ctx: Context,
    @Params('id') messageId: { id: string },
    @CurrentUser() user: User
  ) {
    if (
      (await readMessageById(messageId.id))._doc.user._id.toString() ==
      user._doc._id.toString()
    ) {
      return await readMessagesByUser(user)
    } else {
      ctx.throw(401)
    }
  }

  @Post('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params() messageId: { id: string },
    @CurrentUser() user: User,
    @Body() text: object
  ) {
    if (
      (await readMessageById(messageId.id))._doc.user._id.toString() ==
      user._doc._id.toString()
    ) {
      return await updateMessageById(messageId.id, text)
    } else {
      ctx.throw(401)
    }
  }

  @Delete('/:id')
  async deleteMessage(
    @Ctx() ctx: Context,
    @CurrentUser() user: User,
    @Params() messageId: { id: string }
  ) {
    if (
      (await readMessageById(messageId.id))._doc.user._id.toString() ==
      user._doc._id.toString()
    ) {
      return await deleteMessageById(messageId.id)
    } else {
      ctx.throw(401)
    }
  }
}
