import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
} from 'amala'
import { Context } from 'koa'
import { DocumentType } from '@typegoose/typegoose'
import { User } from '@/models/User'
import MessageBody from '@/validators/MessageBody'
import MessageModel from '@/models/MessageModel'
import authenticate from '@/helpers/authenticate'
import confirmAuthorship from '@/helpers/confirmAuthorship'

@Controller('/message')
@Flow([authenticate, confirmAuthorship])
export default class MessageController {
  @Post('/')
  postMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() author: DocumentType<User>
  ) {
    return MessageModel.create({ author, text })
  }

  @Delete('/:id')
  deleteMessage(@Ctx() ctx: Context) {
    return ctx.state.message.delete()
  }

  @Get('/')
  getMessages(@CurrentUser() { _id }: DocumentType<User>) {
    return MessageModel.find({ author: _id })
  }

  @Get('/:id')
  getMessage(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Put('/:id')
  updateMessage(
    @Body({ required: true }) { text }: MessageBody,
    @Ctx() ctx: Context
  ) {
    const message = ctx.state.message
    message.text = text
    return message.save()
  }
}
