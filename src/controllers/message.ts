import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
} from 'amala'
import { User } from '@/models/User'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/Message'
import MessageBody from '@/validators/MessageBody'
import MessageId from '@/validators/MessageId'
import auth from '@/middleware/auth'
import checkAuthor from '@/middleware/checkAuthor'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  addMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() author: User
  ) {
    return createMessage(author, text)
  }

  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return getMessages(author)
  }

  @Delete('/:id')
  @Flow(checkAuthor)
  deleteMessage(@Params() { id }: MessageId) {
    return deleteMessage(id)
  }

  @Patch('/:id')
  @Flow(checkAuthor)
  updateMessages(
    @Params() { id }: MessageId,
    @Body({ required: true }) { text }: MessageBody
  ) {
    return updateMessage(id, text)
  }
}
