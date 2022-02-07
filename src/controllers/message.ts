import { Body, Controller, Delete, Get, Patch, Post } from 'amala'
import {
  createNewMessage,
  findAndDeleteMessage,
  findAndUpdateMessage,
  findMessage,
} from '@/models/Message'
import Message from '@/validators/Message'

@Controller('/message')
export default class MessageController {
  @Get('/')
  async getMessage(@Body({ required: true }) { id, user_id }: Message) {
    const message = await findMessage({
      messageId: id,
      user_id: user_id ? user_id : undefined,
    })
    return message.messageData
  }

  @Post('/')
  async createMessage(
    @Body({ required: true }) { id, data, user_id }: Message
  ) {
    const message = await createNewMessage({
      messageData: data,
      user_id: user_id,
      messageId: id ? id : undefined,
    })
    return message.messageData
  }

  @Patch('/')
  async updateMessage(
    @Body({ required: true }) { id, data, user_id }: Message
  ) {
    const message = await findAndUpdateMessage({
      messageId: id,
      messageData: data ? data : undefined,
      user_id: user_id ? user_id : undefined,
    })
    return message.messageData
  }

  @Delete('/')
  async deleteMessage(
    @Body({ required: true }) { id, data, user_id }: Message
  ) {
    return await findAndDeleteMessage({
      messageId: id,
      messageData: data ? data : undefined,
      user_id: user_id ? user_id : undefined,
    })
  }
}
