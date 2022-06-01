import { Controller, Body, Get, Post, Put, Delete } from 'amala'
import { Context } from 'koa'
import { Message } from '@/models/messageInterface'
import * as crudService from './messageCrud'

@Controller('/message')
class MessageController {
  @Get('/all')
  async getMessageList(@Body() ctx: Context) {
    try {
      return await crudService.getAllMessages()
    } catch (err: any) {
      console.log(err.message)
    }
  }

  @Post('/post')
  async createMessage(@Body({ required: true }) ctx: Message) {
    try {
      const result = await crudService.createMessage(ctx)
      return result
    } catch (err: any) {
      console.log(err.message)
    }
  }

  @Put('/update')
  async updateMessage(@Body() ctx: Message) {
    try {
      const result = await crudService.updateMessage(ctx)
      return result
    } catch (err: any) {
      console.log(err.message)
    }
  }

  @Put('/delete')
  async deleteMessage(@Body('_id') id: string) {
    try {
      const result = await crudService.deleteMessage(id)
      return result
    } catch (err: any) {
      console.log(err.message)
    }
  }
}
