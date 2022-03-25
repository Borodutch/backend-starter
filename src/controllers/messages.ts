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
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { ObjectId } from 'mongoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import MessageValidator from '@/validators/MessageValidator'
import emailMiddleware from '@/middlewares/email'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  @Flow(emailMiddleware)
  async findAllMessages(@CurrentUser() currentUser: User, @Ctx() ctx: Context) {
    const messages = await MessageModel.find({ author: currentUser })
    if (!messages) {
      return ctx.throw(notFound())
    }
    return messages
  }

  @Get('/:id')
  async findMessageById(@Params('id') id: ObjectId, @Ctx() ctx: Context) {
    const message = await MessageModel.findById(id)
    if (!message) {
      return ctx.throw(notFound())
    }
    return message
  }

  @Post('/')
  @Flow(emailMiddleware)
  async createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() currentUser: User
  ) {
    return await MessageModel.create({ author: currentUser, text })
  }

  @Patch('/update/:id')
  async updateMsgById(
    @Ctx() ctx: Context,
    @Params('id') id: ObjectId,
    @Query('author') author?: string,
    @Query('text') messageText?: string
  ) {
    const updMessage = await MessageModel.findByIdAndUpdate(
      id,
      { author: author, messageText: messageText },
      { new: true }
    )
    if (!updMessage) {
      return ctx.throw(notFound())
    }
    return updMessage
  }

  @Delete('/:id')
  async deleteMsgById(@Params('id') id: ObjectId, @Ctx() ctx: Context) {
    const delMessage = await MessageModel.findByIdAndDelete(id)
    if (!delMessage) {
      return ctx.throw(notFound())
    }
    return delMessage
  }
}
