import { Controller, Body, Post, Get, Params, Delete } from 'amala'
import {
  createMessage,
  readMessageById,
  updateMessageByIdAndText,
  deleteMessageById,
} from '../models/message'

@Controller('/messages')
export default class MessageController {
  @Post('/add')
  async createMessage(@Body() addText: string) {
    await createMessage(addText)
    console.log(addText)
  }

  @Get('/')
  async getMessage(@Params('id') messageId: any) {
    return await readMessageById(messageId)
    console.log(messageId)
  }

  @Post('/:id')
  async updateMessage(@Params('id') messageId: any, @Body() useText: string) {
    return await updateMessageByIdAndText(messageId, useText)
    console.log(messageId)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') messageId: string) {
    return await deleteMessageById(messageId)
    console.log(messageId)
  }
}
