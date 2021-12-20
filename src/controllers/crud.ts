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
    const doc = await MessageModel.find()
    return doc
  }
  @Put('/put/:id')
  async updateMessage(
    @Params('id') _id: string,
    @Body('content') text: string
  ) {
    const doc = await MessageModel.findByIdAndUpdate({ _id }, { text })
    return doc
  }
  @Delete('/delete/:id')
  async deleteMessage(@Params('id') _id: string) {
    const doc = await MessageModel.findByIdAndDelete({ _id })
    return doc
  }
}
