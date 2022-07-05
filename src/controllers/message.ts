import { Body, Controller, Post } from 'amala'
import { CreateMessage } from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/create')
  async create(@Body() Message: any) {
    const messageData = await Message
    const create = await CreateMessage({
      title: messageData.title,
      body: messageData.body,
      id: messageData.id,
    })
    return create
  }
}
