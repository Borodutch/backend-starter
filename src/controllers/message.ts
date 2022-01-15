import { Body, Controller, Delete, Get, Patch, Post } from 'amala'
import {
  createMessage,
  updateMessage,
  getMessages,
  deleteMessage,
} from '@/models/message'

@Controller('/message')
export default class MessageControler {
  @Post('/')
  async addMessage(@Body('text') text: string, @Body('time') time: string) {
    return createMessage(text)
  }
  @Patch('/')
  async updateMessage(@Body('id') id: string, @Body('text') newText: string) {
    return updateMessage(id, newText)
  }
  @Get('/')
  async getMessage() {
    return getMessages()
  }
  @Delete('/')
  async deleteMessage(@Body('id') id: string) {
    return deleteMessage(id)
  }
}
