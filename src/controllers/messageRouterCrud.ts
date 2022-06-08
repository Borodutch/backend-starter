import { Controller, Body, Get, Post, Put, Params, Delete } from 'amala'
import {
  getMessageList,
  createMessage,
  updateMessage,
  deleteMessage,
} from '@/models/Message'

@Controller('/message')
class MessageController {
  @Get('/all')
  async getMessageList() {
    return getMessageList()
  }

  @Post('/')
  async createMessage(@Body({ required: true }) message: any) {
    await createMessage(message)
  }

  @Put('/')
  async updateMessage(@Body({ required: true }) message: any) {
    await updateMessage(message)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    await deleteMessage(id)
  }
}
