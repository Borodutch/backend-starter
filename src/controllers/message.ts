import { Body, Controller, Delete, Get, Patch, Post } from 'amala'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/message'

@Controller('/message')
export default class MessageControler {
  @Post('/')
  async addMessage(@Body('user') user: string, @Body('text') text: string) {
    return await createMessage(user, text)
  }
  @Patch('/')
  async updateMessage(
    @Body('user') user: string,
    @Body('id') id: string,
    @Body('text') newText: string
  ) {
    return await updateMessage(user, id, newText)
  }
  @Get('/')
  async getMessages(@Body('user') user: string) {
    return await getMessages(user)
  }
  @Delete('/')
  async deleteMessage(@Body('user') user: string, @Body('id') id: string) {
    return await deleteMessage(user, id)
  }
}
