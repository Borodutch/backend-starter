import { Controller, Body, Get, Post, Put } from 'amala'
import { Context } from 'koa'
import {
  getAllMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from '@/controllers/messageCrud'

@Controller('/message')
class MessageController {
  @Get('/all')
  async getMessageList() {
    return await getAllMessages()
  }

  @Post('/post')
  async createMessage(@Body({ required: true }) ctx: Context) {
    const result = await createMessage(ctx)
    return result
  }

  @Put('/update')
  async updateMessage(@Body() ctx: Context) {
    const result = await updateMessage(ctx)
    return result
  }

  @Put('/delete')
  async deleteMessage(@Body('_id') id: string) {
    const result = await deleteMessage(id)
    return result
  }
}
