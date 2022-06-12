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
import { checkAuthor, getMessage } from '@/middlewares/message'
import MessageState from '@/validators/MessageState'
import MessageText from '@/validators/MessageText'
import authenticate from '@/middlewares/authenticate'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow([getMessage, checkAuthor])
  getMessageDetails(@State() { message }: MessageState) {
    return message
  }

  @Post('/')
  createMessaxge(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.create({ text, author })
  }

  @Put('/:id')
  @Flow([getMessage, checkAuthor])
  updateMessage(
    @State() message: Message,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.findOneAndUpdate(message, { text })
  }

  @Delete('/:id')
  @Flow([getMessage, checkAuthor])
  messageDelete(@State() { message }: MessageState) {
    return MessageModel.findOneAndRemove(message)
  }
}
