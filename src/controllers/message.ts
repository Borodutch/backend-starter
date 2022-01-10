import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/Message'
import { MessageText } from '@/validators/Message'
import { User } from '@/models/user'
import authorize from '@/middleware/authorize'
import findUserMsg from '@/middleware/findUserMsg'

@Controller('/messages')
@Flow(authorize)
export default class MessageController {
  @Get('/')
  getAllMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  postMessage(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.create({
      author,
      text,
    })
  }

  @Get('/:id')
  @Flow(findUserMsg)
  getMessage(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Post('/:id')
  @Flow(findUserMsg)
  async updateMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageText
  ) {
    ctx.state.message.text = text
    await ctx.state.message.save()
    return ctx.state.message
  }

  @Delete('/:id')
  @Flow(findUserMsg)
  async deleteMsg(@Ctx() ctx: Context) {
    await MessageModel.findByIdAndRemove(ctx.state.message)
    return { success: true }
  }
}
