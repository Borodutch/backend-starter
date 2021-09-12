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
import { auth } from '@/middleware/auth'
import { Context } from 'koa'
import { checkRights } from '@/middleware/checkRights'

@Controller('/message')
@Flow(auth)
export class MessageController {
  @Post('/')
  async addMessage(@Body('text') text: string, @CurrentUser() author: string) {
    return await MessageModel.create({ text, author })
  }

  @Get('/')
  async getMessages(@CurrentUser() author: string) {
    return await MessageModel.find({ author })
  }

  @Flow(checkRights)
  @Delete('/:id')
  async delMessage(@Ctx() ctx: Context) {
    return await ctx.state.message.remove()
  }

  @Flow(checkRights)
  @Put('/:id')
  async putMessage(@Ctx() ctx: Context, @Body('text') text: string) {
    ctx.state.message.text = text
    return await ctx.state.message.save()
  }
}
