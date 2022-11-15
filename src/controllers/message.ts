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
import verifyUser from '@/middleware/verifyUser'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  create(
    @Body({ required: true }) { text }: Message,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Flow(verifyUser)
  @Get('/:id')
  get(@State('message') message: Message) {
    return MessageModel.findById(message)
  }

  @Flow(verifyUser)
  @Put('/:id')
  async update(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: Message
  ) {
    await MessageModel.findByIdAndUpdate(message, { text })
    return MessageModel.findById(message)
  }

  @Flow(verifyUser)
  @Delete('/:id')
  delete(@State('message') message: Message) {
    return MessageModel.findByIdAndDelete(message)
  }
}
