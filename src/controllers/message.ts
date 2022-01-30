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
import auth from '@/middleware/auth'
import checkAuthor from '@/middleware/checkAuthor'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  addMessage(@Body('text') text: string, @CurrentUser() author: User) {
    return createMessage(author, text)
  }
  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return getMessages(author)
  }

  @Delete('/:id')
  @Flow(checkAuthor)
  deleteMessage(@Params('id') id: string) {
    console.log(id)
    return deleteMessage(id)
  }

  @Patch('/:id')
  @Flow(checkAuthor)
  updateMessages(@Params('id') id: string, @Body('text') updatedText: string) {
    return updateMessage(id, updatedText)
  }
}
