import {
  Body,
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Ctx,
  Flow,
  CurrentUser,
  Params,
} from 'amala'
import { User } from '@/models/User'
import { MessageModel } from '@/models/Messages'
import { MessageTextValidator, MessageIdValidator } from '@/validators/Messages'
import { checkUser, checkMessage } from '@/middleware/authMiddleware'
import { notFound } from '@hapi/boom'
import { Context } from 'koa'

@Controller('/messages')
@Flow([checkUser])
export default class MessageController {
  @Post('/')
  async createMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageTextValidator,
    @CurrentUser() user: User
  ) {
    if (user)
      return MessageModel.create({
        user,
        text,
      })
    return ctx.throw(notFound('User not found'))
  }

  @Get('/')
  async getMessages(@CurrentUser() user: User) {
    return MessageModel.find({ user })
  }

  @Get('/:messageId')
  @Flow([checkMessage])
  async getMessage(
    @Ctx() ctx: Context,
    @Params() { messageId }: MessageIdValidator
  ) {
    return ctx.state.message
  }

  @Put('/:messageId')
  @Flow([checkMessage])
  async editMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageTextValidator,
    @Params() { messageId }: MessageIdValidator
  ) {
    const message = ctx.state.message
    return MessageModel.findByIdAndUpdate(message._id, { text })
  }

  @Delete('/:messageId')
  @Flow([checkMessage])
  async deleteMessage(
    @Ctx() ctx: Context,
    @Params() { messageId }: MessageIdValidator
  ) {
    const message = ctx.state.message
    return MessageModel.findByIdAndDelete(message._id)
  }
}
