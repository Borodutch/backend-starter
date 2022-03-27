import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
  Query,
  State,
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { ObjectId } from 'mongoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import MessageValidator from '@/validators/MessageValidator'
import emailMiddleware from '@/middlewares/emailMiddleware'
import messageMiddleware from '@/middlewares/messageMiddleware'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  @Flow(emailMiddleware)
  async findAllMessages(@CurrentUser() currentUser: User) {
    return MessageModel.find({ author: currentUser })
  }

  @Get('/:id')
  @Flow([emailMiddleware, messageMiddleware])
  findMessageById(@State('message') message: MessageValidator) {
    return message
  }

  @Post('/')
  @Flow(emailMiddleware)
  async createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() currentUser: User
  ) {
    return MessageModel.create({ author: currentUser, text })
  }

  @Patch('/update/:id')
  @Flow([emailMiddleware, messageMiddleware])
  async updateMsgById(
    @Ctx() ctx: Context,
    @State('message') message: MessageValidator,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    const updMessage = await MessageModel.findByIdAndUpdate(
      message,
      { text },
      { new: true }
    )
    if (!updMessage) {
      return ctx.throw(notFound())
    }
    return updMessage
  }

  @Delete('/:id')
  @Flow([emailMiddleware, messageMiddleware])
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
