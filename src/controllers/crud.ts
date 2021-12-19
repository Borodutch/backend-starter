import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import { MessageModel, findOrCreateMessage } from '@/models/message'
import MessageBody from '@/validators/MessageBody'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async postMessage(@Body({ required: true }) { author, text }: MessageBody) {
    const { doc } = await findOrCreateMessage(author, text)
    return doc
  }
  @Get('/')
  async getMessage() {
    return MessageModel.find()
  }
  @Put('/put/:id')
  async updateMessage(
    @Params('id') _id: string,
    @Body('content') text: string
  ) {
    return MessageModel.findByIdAndUpdate({ _id }, { text })
  }
  @Delete('/delete/:id')
  async deleteMessage(@Params('id') _id: string) {
    return MessageModel.findByIdAndDelete({ _id })
  }
}
