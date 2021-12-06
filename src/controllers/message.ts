import { Context } from 'koa'
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
  State,
} from 'amala'
import { Message, MessageModel } from '@/models/message'
import { User } from '@/models/user'
import MessageValidator from '@/validators/MessageValidator'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessages(@State('message') message: Message) {
    return message
  }

  @Put('/:id')
  @Flow(checkUser)
  updateMessage(
    @Ctx() ctx: Context,
    @State({ required: true }) { text }: MessageValidator,
    @Body({ required: true }) { text: newText }: MessageValidator
  ) {
    text = newText
    return ctx.state.message.save()
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessage(@State('message') message: Message) {
    return MessageModel.findOneAndDelete(message)
  }
}
