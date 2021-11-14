import { Body, Controller, Delete, Get, Patch, Post } from 'amala'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(@Body('text') text: string): Promise<void> {
    await createMessage(text)
  }

  @Patch('/')
  async updateMessage(
    @Body('id') id: string,
    @Body('text') newText: string
  ): Promise<void> {
    await updateMessage(id, newText)
  }

  @Get('/')
  async getMessages(): Promise<void> {
    await getMessages()
  }

  @Delete('/')
  async deleteMessage(@Body('id') id: string): Promise<void> {
    await deleteMessage(id)
  }
}
