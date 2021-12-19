import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import { MessageModel, findOrCreateMessage } from '@/models/message'
import MessageApi from '@/validators/MessageApi'

@Controller('/message')
export default class MessageController {
  @Post('/post')
  async postMessage(@Body({ required: true }) { name, content }: MessageApi) {
    const { doc } = await findOrCreateMessage({
      name,
      content,
    })
    return doc
  }
  @Get('/get')
  async getMessage() {
    return await MessageModel.find()
  }
  @Put('/put/:id')
  async updateMessage(
    @Params('id') _id: string,
    @Body('content') content: string
  ) {
    return await MessageModel.findByIdAndUpdate({ _id }, { content })
  }
  @Delete('/delete/:id')
  async deleteMessage(@Params('id') _id: string) {
    return await MessageModel.findByIdAndDelete({ _id })
  }
}
