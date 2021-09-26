import { Context } from 'koa'
import { Body, Controller, Delete, Get, Post, Put } from 'amala'
import { MessageModel } from '@/models/message'

@Controller('/message')
export class messageController {
  @Post('/')
  async postMessage(@Body('message') message: string) {
    return await MessageModel.create({ text: message })
  }
  @Get('/:id')
  async receiveMessage(@Body('id') id: undefined) {
    return await MessageModel.findOne({ _id: id })
  }
  @Put('/:id')
  async updateMessage(
    @Body('id') id: undefined,
    @Body('newText') newText: string
  ) {
    const message = await MessageModel.findOne({ _id: id })
    message.text = newText
    message.save()
    return 'Updated succesfully!'
  }
  @Delete('/:id')
  async deleteMessage(@Body('id') id: undefined) {
    await MessageModel.deleteOne({ _id: id })
    return 'Deleted succesfully'
  }
}
