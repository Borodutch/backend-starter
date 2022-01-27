import { Controller, Delete, Get, Patch, Post, Query } from 'amala'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(@Query('user') user: string, @Query('text') text: string) {
    return await createMessage(user, text)
  }
  @Get('/')
  async getMessages(@Query('user') user: string) {
    return await getMessages(user)
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
