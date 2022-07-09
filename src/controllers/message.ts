import { Body, Controller, Post } from 'amala'
import { Message, MessageModel } from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async create(@Body() message: Message) {
    return await MessageModel.create(message)
  }
}
