import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'

import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageText from '@/validators/MessageText'
import authenticate from '@/middleware/authenticate'
import verifyAuthor from '@/middleware/verifyAuthor'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  create(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  getMessage(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Flow(verifyAuthor)
  @Get('/:id')
  get(@State('message') message: Message) {
    return MessageModel.findById(message)
  }

  @Flow(verifyAuthor)
  @Put('/:id')
  async update(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: Message
  ) {
    await MessageModel.updateOne(message, { text })
    return MessageModel.findById(message)
  }

  @Flow(verifyAuthor)
  @Delete('/:id')
  delete(@State('message') message: Message) {
    return MessageModel.findByIdAndDelete(message)
  }
}
