import { MessageModel } from '@/models/message'
import {
  Controller,
  Body,
  Ctx,
  Get,
  Flow,
  Post,
  Put,
  Params,
  Delete,
  CurrentUser,
} from 'amala'
import { requireAuth } from '@/middleware/auth'
import { isAuthor } from '@/middleware/message'
import { Context } from 'koa'
import { User } from '@/models/user'

@Controller('/messages')
@Flow(requireAuth)
export class MessageController {
  @Post('/create')
  async createMessage(
    @Body('text') text: string,
    @Ctx() ctx: Context,
    @CurrentUser() user: User
  ) {
    try {
      const message = await MessageModel.create({
        body: text,
        author: user.name,
      })
      return message
    } catch (error) {
      return ctx.throw(403, 'Unable to create a message')
    }
  }

  @Get('/')
  async listMessages(@CurrentUser() user: User, @Ctx() ctx: Context) {
    try {
      const messages = await MessageModel.find({ author: user.name })
      return messages
    } catch (error) {
      return ctx.throw(500, 'Unable to display your mesasges')
    }
  }

  @Get('/:id')
  @Flow(isAuthor)
  async listSpecificMessage(@Params('id') id: string, @Ctx() ctx: Context) {
    try {
      const message = await MessageModel.findById(id)
      return message
    } catch (error) {
      return ctx.throw(500, 'Unable to display your mesasge')
    }
  }

  @Put('/:id')
  @Flow(isAuthor)
  async updateMessage(
    @Params('id') id: string,
    @Body('text') text: string,
    @Ctx() ctx: Context
  ) {
    try {
      const message = await MessageModel.findById(id)
      message.body = text
      message.save()
      ctx.redirect('/messages')
    } catch (error) {
      return ctx.throw(500, 'Unable to update your message')
    }
  }

  @Delete('/:id')
  @Flow(isAuthor)
  async deleteMessage(@Params('id') id: string, @Ctx() ctx: Context) {
    try {
      await MessageModel.deleteOne({ _id: id })
      ctx.redirect('/messages')
    } catch (error) {
      return ctx.throw(500, 'Unable to delete your message')
    }
  }
}
