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
} from 'amala'
import { Context } from 'koa'
import { User } from '@/models/User'
import { MessageModel } from '@/models/Messages'
import { MessageTextValidator } from '@/validators/Messages'
import checkUser from '@/middleware/authMiddleware'
import checkMessage from '@/middleware/messageMiddleware'

@Controller('/messages')
@Flow([checkUser])
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body({ required: true }) { text }: MessageTextValidator,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({
      user,
      text,
    })
  }

  @Get('/')
  async getMessages(@CurrentUser() user: User) {
    return MessageModel.find({ user })
  }

  @Get('/:messageId')
  @Flow([checkMessage])
  async getMessage(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Put('/:messageId')
  @Flow([checkMessage])
  async editMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageTextValidator
  ) {
    const message = ctx.state.message
    return MessageModel.findByIdAndUpdate(message._id, { text })
  }

  @Delete('/:messageId')
  @Flow([checkMessage])
  async deleteMessage(@Ctx() ctx: Context) {
    const message = ctx.state.message
    return MessageModel.findByIdAndDelete(message._id)
  }
}
