import { MessageModel } from '@/models/message'
import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'

@Controller('/message')
export default class messageController {
  @Get('/')
  async receiveMessages() {
    return await MessageModel.find()
  }

  @Post('/')
  async createMessage(@Body('newMessage') text: string) {
    return MessageModel.create({ text })
  }

  @Put('/:id')
  async updateMessage(
    @Params('id') id: string,
    @Body('newMessage') text: string
  ) {
    MessageModel.findByIdAndUpdate(id, { text })
    return MessageModel.findById(id)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    return MessageModel.findByIdAndDelete(id)
  }
}
