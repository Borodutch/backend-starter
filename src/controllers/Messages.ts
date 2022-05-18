import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import { MessageModel } from '@/models/Message'
import IdIsAString from '@/validators/ValidId'
import MessageText from '@/validators/ValidMessage'

@Controller('/messages')
export default class MessagesController {
  @Get('/')
  allMessages() {
    return MessageModel.find({})
  }

  @Post('/')
  createMessage(@Body({ required: true }) { text }: MessageText) {
    return MessageModel.create({ text })
  }

  @Put('/:id')
  async updateMessage(
    @Body({ required: true }) { text }: MessageText,
    @Params('id') id: IdIsAString
  ) {
    await MessageModel.findByIdAndUpdate({ _id: id }, { text })
    return MessageModel.findOne({ id, text })
  }

  @Delete('/:id')
  deleteMessage(@Params('id') id: IdIsAString) {
    return MessageModel.findByIdAndRemove({ _id: id })
  }
}
