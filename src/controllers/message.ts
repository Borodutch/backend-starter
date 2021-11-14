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
    try {
      await createMessage(text)
    } catch (e) {
      console.log(`Adding message failed: ${e.message}`)
    }
  }

  @Patch('/')
  async updateMessage(
    @Body('id') id: string,
    @Body('text') newText: string
  ): Promise<void> {
    try {
      await updateMessage(id, newText)
    } catch (e) {
      console.log(`Update message failed: ${e.message}`)
    }
  }

  @Get('/')
  async getMessages(): Promise<void> {
    try {
      await getMessages()
    } catch (e) {
      console.log(`Receiving messages failed: ${e.message}`)
    }
  }

  @Delete('/')
  async deleteMessage(@Body('id') id: string): Promise<void> {
    try {
      await deleteMessage(id)
    } catch (e) {
      console.log(`Message deletion failed: ${e.message}`)
    }
  }
}
