import { Body, Controller, Post } from 'amala'
import { Message, MessageModel } from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async create(@Body() message: Message) {
    await MessageModel.create({
      title: message.title,
      body: message.body,
      id: message._id,
    })
    return message
  }
}
