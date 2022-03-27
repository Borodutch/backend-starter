import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Patch,
  Post,
  State,
} from 'amala'
import { Context } from 'koa'
import { Message, MessageModel } from '@/models/message'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import MessageValidator from '@/validators/MessageValidator'
import authMiddleware from '@/middlewares/authMiddleware'
import messageMiddleware from '@/middlewares/messageMiddleware'

@Controller('/messages')
@Flow(authMiddleware)
export default class MessageController {
  @Get('/')
  findAllMessages(@CurrentUser() currentUser: User) {
    return MessageModel.find({ author: currentUser })
  }

  @Get('/:id')
  @Flow(messageMiddleware)
  findMessageById(@State('message') message: Message) {
    return message
  }

  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() currentUser: User
  ) {
    return MessageModel.create({ author: currentUser, text })
  }

  @Patch('/:id')
  @Flow(messageMiddleware)
  async updateMsgById(
    @Ctx() ctx: Context,
    @State('message') message: MessageValidator,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      message,
      { text },
      { new: true }
    )
    if (!updatedMessage) {
      return ctx.throw(notFound())
    }
    return updatedMessage
  }

  @Delete('/:id')
  @Flow(messageMiddleware)
  async deleteMsgById(
    @State('message') message: MessageValidator,
    @Ctx() ctx: Context
  ) {
    const delMessage = await MessageModel.findByIdAndDelete(message)
    if (!delMessage) {
      return ctx.throw(notFound())
    }
    return delMessage
  }
}
