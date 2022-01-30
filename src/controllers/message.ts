import {
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Patch,
  Post,
  Query,
} from 'amala'
import { User } from '@/models/User'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/Message'
import auth from '@/middleware/auth'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  addMessage(@Query('text') text: string, @CurrentUser() author: User) {
    return createMessage(author, text)
  }
  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return getMessages(author)
  }

  @Delete('/')
  deleteMessage(@Query('id') id: string) {
    return deleteMessage(id)
  }

  @Patch('/')
  updateMessages(@Query('text') newText: string, @Query('id') id: string) {
    return updateMessage(id, newText)
  }
}
