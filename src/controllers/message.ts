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
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
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
  getMessages(@State({ required: true }) { text }: MessageValidator) {
    return text
  }

  @Put('/:id')
  @Flow(checkUser)
  updateMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    ctx.state.message.text = text
    return ctx.state.message.save()
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessage(@State({ required: true }) { text }: MessageValidator) {
    return MessageModel.findOneAndDelete({ text })
  }
}
