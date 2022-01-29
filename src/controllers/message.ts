import { Body, Controller, Delete, Get, Patch, Post, Query } from 'amala'
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
  async addMessage(@Query({ required: true }) { author, text }: MessageBody) {
    return await createMessage(author, text)
  }
  @Get('/')
  async getMessages(@Query('author') author: Ref<User>) {
    return await getMessages(author)
  }
  @Delete('/')
  async deleteMessage(@Query('id') id: string) {
    return await deleteMessage(id)
  }
  @Patch('/')
  async updateMessages(
    @Query('text') updatedText: string,
    @Query('id') id: string
  ) {
    return await updateMessage(id, updatedText)
  }
}
