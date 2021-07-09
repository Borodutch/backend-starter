import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Flow,
  CurrentUser,
  Ctx,
  Put,
} from 'amala'
import { MessageModel } from '@/models/message'
import { authenticate } from '@/middlewares/auth'
import { checkMessageAuthor } from '@/middlewares/checkMessageAuthor'
import { User } from '@/models/user'
import { Context } from 'koa'

@Flow(authenticate)
@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(@Body('text') text: string, @CurrentUser() user: User) {
    return await new MessageModel({ user, text }).save()
  }

  @Flow(checkMessageAuthor)
  @Get('/:id')
  getMessage(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Flow(checkMessageAuthor)
  @Put('/:id')
  async updateMessage(@Ctx() ctx: Context, @Body('text') text: string) {
    ctx.state.message.text = text
    return ctx.state.message.save()
  }

  @Flow(checkMessageAuthor)
  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    return await MessageModel.deleteOne({ _id: ctx.state.message.id })
  }
}
