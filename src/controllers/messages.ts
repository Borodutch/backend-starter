import { Body, Controller, Post, Delete, Put, Get, Params, Ctx } from 'amala'
import { UserModel } from '@/models/User'
import { MessageModel } from '@/models/Messages'
import {
  MessageUserIdTextValidator,
  MessageIdValidator,
  MessageTextValidator,
} from '@/validators/Messages'
import { notFound } from '@hapi/boom'
import { Context } from 'koa'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(
    @Ctx() ctx: Context,
    @Body({ required: true })
    { userId, text }: MessageUserIdTextValidator
  ) {
    const user = await UserModel.findById(userId)
    if (user)
      return MessageModel.create({
        user,
        text,
      })

    return ctx.throw(notFound('User not found'))
  }

  @Get('/')
  async getMessages() {
    return MessageModel.find()
  }

  @Get('/:messageId')
  async getMessage(
    @Ctx() ctx: Context,
    @Params() { messageId }: MessageIdValidator
  ) {
    const message = await MessageModel.findById(messageId)
    if (!message) ctx.throw(notFound('messageId not found'))
    return message
  }

  @Put('/:messageId')
  async editMessage(
    @Ctx() ctx: Context,
    @Params() { messageId }: MessageIdValidator,
    @Body({ required: true }) { text }: MessageTextValidator
  ) {
    const message = await MessageModel.findByIdAndUpdate(messageId, {
      text,
    })
    if (!message) ctx.throw(notFound('messageId not found'))
    return message
  }

  @Delete('/:messageId')
  async deleteMessage(
    @Ctx() ctx: Context,
    @Params() { messageId }: MessageIdValidator
  ) {
    const message = await MessageModel.findByIdAndDelete(messageId)
    if (!message) ctx.throw(notFound('messageId not found'))
    return message
  }
}
