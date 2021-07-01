import { Controller, Body, Post, Get, Params, Delete } from 'amala'
import {
  createMessage,
  readMessageById,
  updateMessageByIdAndText,
  deleteMessageById,
} from '@/models/message'

@Controller('/messages')
export default class MessageController {
  @Post('/add')
  async createMessage(@Body() body: string) {
    await createMessage(body)
    console.log(body)
  }

  @Get('/')
  async getMessage(@Params('id') messageId: string) {
    return await readMessageById(messageId)
  }

  @Post('/:id')
  async updateMessage(@Params('id') messageId: string, @Body() body: string) {
    return await updateMessageByIdAndText(messageId, body)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') messageId: string) {
    return await deleteMessageById(messageId)
  }
}
