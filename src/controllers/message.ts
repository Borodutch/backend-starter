import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Patch,
  Post,
  State,
} from 'amala'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageText from '@/validators/Message'
import authenticate from '@/middleware/authenticate'
import verifyUser from '@/middleware/verifyUser'

@Controller('/messages')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({ text, user })
  }

  @Flow(verifyUser)
  @Delete('/:id')
  deleteMessage(@State('message') message: Message) {
    return MessageModel.findByIdAndDelete(message)
  }

  @Flow(verifyUser)
  @Get('/:id')
  getMessageById(@State('message') message: Message) {
    return MessageModel.findById(message)
  }

  @Flow(verifyUser)
  @Patch('/:id')
  async UpdateMessage(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: Message
  ) {
    await MessageModel.findByIdAndUpdate(message, { text })
    return MessageModel.findById(message)
  }
}
