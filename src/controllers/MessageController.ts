import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import MessageModel from '@/models/MessageModel'
import MessageValidator from '@/validators/MessageValidator'

@Controller('/message')
export default class MessageController {
  @Post('/')
  postMessage(@Body({ required: true }) message: MessageValidator) {
    return MessageModel.create(message)
  }

  @Delete('/deleteAll/')
  deleteAllMessages() {
    return MessageModel.deleteMany()
  }

  @Delete('/:id')
  deleteMessage(@Params('id') id: string) {
    return MessageModel.findOneAndDelete({ _id: id })
  }

  @Get('/')
  getMessages() {
    return MessageModel.find()
  }

  @Get('/:id')
  getMessage(@Params('id') id: string) {
    return MessageModel.findOne({ _id: id })
  }

  @Put('/:id')
  updateMessage(
    @Params('id') id: string,
    @Body({ required: true }) text: string
  ) {
    return MessageModel.findOneAndUpdate({ _id: id }, { text }, { new: true })
  }
}
