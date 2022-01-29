import { Controller, Delete, Get, Patch, Post, Query } from 'amala'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/Message'
import MessageBody from '@/validators/MessageBody'

@Controller('/message')
export default class MessageController {
  @Post('/')
  addMessage(@Query({ required: true }) { author, text }: MessageBody) {
    return createMessage(author, text)
  }
  @Get('/')
  getMessages(@Query('author') author: Ref<User>) {
    return getMessages(author)
  }
  @Delete('/')
  deleteMessage(@Query('id') id: string) {
    return deleteMessage(id)
  }
  @Patch('/')
  updateMessages(@Query('text') updatedText: string, @Query('id') id: string) {
    return updateMessage(id, updatedText)
  }
}
