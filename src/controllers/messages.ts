import { Controller, Body, Post, Get, Params, Put, Delete } from 'amala'
import {
  createMessage,
  readMessageById,
  updateMessageByIdAndText,
  deleteMessageById,
} from '@/models/message'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(@Body() body: object) {
    await createMessage(body)
  }

  @Get('/:id')
  async getMessage(@Params('id') messageId: string) {
    return await readMessageById(messageId)
  }

  @Post('/:id')
  async updateMessage(
    @Params('id') messageId: string,
    @Body() body: { text: string }
  ) {
    return await updateMessageByIdAndText(messageId, body)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') messageId: string) {
    return await deleteMessageById(messageId)
  }
}
