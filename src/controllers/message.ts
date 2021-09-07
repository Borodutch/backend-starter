import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Params,
  Flow,
  CurrentUser,
  Ctx,
} from 'amala'
import { MessageModel } from '@/models/message'
import { auth, authMessage } from '@/middleware/auth'
import { Context } from 'koa'

@Controller('/message')
export class MessageController {
  @Flow(auth)
  @Post('/')
  async addMessage(@Body('text') text: string, @CurrentUser() author: string) {
    return await MessageModel.create({ text, author })
  }
  @Flow(auth)
  @Get('/')
  async getMessages(@CurrentUser() author: string) {
    return await MessageModel.find({ author })
  }

  @Flow(authMessage)
  @Delete('/:id')
  async delMessage(@Ctx() ctx: Context) {
    return ctx.state.message.remove()
  }

  @Flow(authMessage)
  @Put('/:id')
  async putMessage(@Ctx() ctx: Context, @Body('text') text: string) {
    ctx.state.message.text = text
    return await ctx.state.message.save()
  }
}
