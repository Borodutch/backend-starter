import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/messages'
import { User } from '@/models/user'
import { authentication } from '@/middlewares/auth'
import { checkUser } from '@/middlewares/checkUser'

@Flow(authentication)
@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(@Body('text') text: string, @CurrentUser() author: User) {
    return await new MessageModel({ author, text }).save()
  }

  @Flow(checkUser)
  @Get('/:id')
  getMessage(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Flow(checkUser)
  @Put('/:id')
  async updateMessage(@Ctx() ctx: Context, @Body('text') text: string) {
    ctx.state.message.text = text
    return await ctx.state.message.save()
  }

  @Flow(checkUser)
  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    return await ctx.state.message.remove()
  }
}
