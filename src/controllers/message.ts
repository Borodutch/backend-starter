import { Body, Controller, Post } from 'amala'
import { createMessage } from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(@Body('user') user: string, @Body('text') text: string) {
    return await createMessage(user, text)
  }
}
