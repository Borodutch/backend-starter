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
import MessageText from '@/validators/MessageText'
import authenticate from '@/middleware/authenticate'
import checkUser from '@/middleware/checkUser'

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
  getAllMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessageById(@State('message') message: Message) {
    return message
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessageById(@State('message') message: Message) {
    return MessageModel.findByIdAndDelete(message)
  }

  @Patch('/:id')
  @Flow(checkUser)
  UpdateMessage(
    @State('message') message: Message,
    @Body() { text }: MessageText
  ) {
    return MessageModel.findByIdAndUpdate(message, { text })
  }
}
