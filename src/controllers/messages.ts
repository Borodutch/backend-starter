import { Controller, Get, Post, Put, Delete, Body, Params } from 'amala'
import { messageModel } from '@/models/message'

@Controller('/message')
export class MessageController {
  @Post('/')
  async addMessage(@Body('message') text: string) {
    return await messageModel.create({ text })
  }

  @Get('/')
  async getMessages() {
    return await messageModel.find()
  }

  @Delete('/:id')
  async delMessage(@Params('id') _id: string) {
    const deletedText = await messageModel.deleteOne({ _id })
    return { _id, deleted: true }
  }

  @Put('/:id')
  async putMessage(@Params('id') _id: string, @Body('text') newText: string) {
    const message = await messageModel.findOne({ _id })
    message.text = newText
    await message.save()
    return message
  }
}
