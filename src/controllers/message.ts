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
import { MessageModel } from '@/models/message'
import { MessageText } from '@/validators/Message'
import { User } from '@/models/user'
import authorize from '@/middleware/authorize'
import findUserMsg from '@/middleware/findUserMsg'

@Controller('/messages')
@Flow(authorize)
export default class MessageController {
  @Get('/')
  getAllMessages(@CurrentUser() user: User) {
    return MessageModel.find({ author: user })
  }

  @Post('/')
  async postMessage(
    @CurrentUser() user: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    const message = await MessageModel.create({
      author: user,
      text,
    })
    return message
  }

  @Get('/:id')
  @Flow(findUserMsg)
  getMessage(@Ctx() ctx: Context) {
    return ctx.state.msg
  }

  @Post('/:id')
  @Flow(findUserMsg)
  async updateMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageText
  ) {
    ctx.state.msg.text = text
    await ctx.state.msg.save()
    return ctx.state.msg
  }

  @Delete('/:id')
  @Flow(findUserMsg)
  async deleteMsg(@Ctx() ctx: Context) {
    await MessageModel.findByIdAndRemove(ctx.state.msg)
    return `You've deleted message ${ctx.state.msg}`
  }
}
