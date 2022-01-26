import { Controller, Delete, Get, Header, Patch, Post } from 'amala'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(@Header('user') user: string, @Header('text') text: string) {
    return await createMessage(user, text)
  }
  @Get('/')
  async getMessages(@Header('user') user: string) {
    return await getMessages(user)
  }
  @Delete('/')
  async deleteMessage(@Header('id') id: string) {
    return await deleteMessage(id)
  }
  @Patch('/')
  async updateMessages(
    @Header('text') updatedText: string,
    @Header('id') id: string
  ) {
    return await updateMessage(id, updatedText)
  }
}
