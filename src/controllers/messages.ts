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
import { Message, MessageModel } from '@/models/message'
import { User } from '@/models/User'
import MessageValidator from '@/validators/MessageValidator'
import authMiddleware from '@/middlewares/authMiddleware'
import messageMiddleware from '@/middlewares/messageMiddleware'

@Controller('/messages')
@Flow(authMiddleware)
export default class MessageController {
  @Get('/')
  findAllMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(messageMiddleware)
  findMessageById(@State('message') message: Message) {
    return message
  }

  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ author, text })
  }

  @Patch('/:id')
  @Flow(messageMiddleware)
  async updateMsgById(
    @State('message') message: MessageValidator,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    return MessageModel.findByIdAndUpdate(message, { text }, { new: true })
  }

  @Delete('/:id')
  @Flow(messageMiddleware)
  async deleteMsgById(@State('message') message: MessageValidator) {
    return MessageModel.findByIdAndDelete(message)
  }
}
