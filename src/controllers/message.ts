import { Body, Controller, Delete, Get, Patch, Post } from 'amala'
import { crudMessage } from '@/models/message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(
    @Body('text') text: string,
    @Body('time') time: string
  ): Promise<void> {
    await crudMessage.createMessage(text, time)
  }

  @Patch('/')
  async updateMessage(
    @Body('id') id: string,
    @Body('text') newText: string
  ): Promise<void> {
    await crudMessage.updateMessage(id, newText)
  }

  @Get('/')
  async getMessages(): Promise<any> {
    const messages = await crudMessage.getMessages()
    return messages
  }

  @Delete('/')
  async deleteMessage(@Body('id') id: string): Promise<void> {
    await crudMessage.deleteMessage(id)
  }
}
