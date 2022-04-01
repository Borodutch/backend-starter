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
} from 'amala'
import { Context } from 'vm'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageValidator from '@/validators/MessageValidator'
import authorMiddleware from '@/helpers/authorMiddleware'
import tokenMiddleware from '@/helpers/tokenMiddleware'

@Controller('/messages')
@Flow(tokenMiddleware)
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author: author })
  }

  @Patch('/:id')
  @Flow(authorMiddleware)
  updateMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    ctx.state.message.text = text
    return ctx.state.message.save()
  }

  @Delete('/:id')
  @Flow(authorMiddleware)
  removeMessage(@Ctx() ctx: Context) {
    return ctx.state.message.remove()
  }
}
