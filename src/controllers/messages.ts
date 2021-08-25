import { Controller, Get, Post, Put, Delete, Body, Params } from 'amala'
import { messageModel } from '@/models/message'

@Controller('/message')
export class MessageController {
  @Post('/')
  async addMessage(@Body('message') message: string) {
    const newMessage = await messageModel.create({ text: message })
    return newMessage
  }

  @Get('/')
  async getMessages() {
    const messages = await messageModel.find()
    return messages
  }

  @Delete('/:id')
  async delMessage(@Params('id') id: any) {
    await messageModel.deleteOne({ _id: id })
    return `Сообщение с ID: ${id} удалено`
  }

  @Put('/:id')
  async putMessage(@Params('id') id: any, @Body('newMessage') newText: string) {
    const message = await messageModel.findOne({ _id: id })
    message.text = newText
    await message.save()
    return `Собщение измененено: ${message}`
  }
}
