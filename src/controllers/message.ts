import { Body, Controller, Delete, Get, IsString, Patch, Post } from 'amala'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/message'

@Controller('/message')
export default class MessageController {
  @IsString()
  @Post('/')
  async addMessage(@Body('text') text: string) {
    await createMessage(text)
  }
  @IsString()
  @Patch('/')
  async updateMessage(@Body('id') id: string, @Body('text') newText: string) {
    await updateMessage(id, newText)
  }
  @IsString()
  @Get('/')
  async getMessages() {
    await getMessages()
  }
  @IsString()
  @Delete('/')
  async deleteMessage(@Body('id') id: string) {
    await deleteMessage(id)
  }
}
