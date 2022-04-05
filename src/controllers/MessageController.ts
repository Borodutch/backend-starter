import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import MessageModel from '@/models/MessageModel'
import MessageValidator from '@/validators/MessageValidator'
import checkMongoId from '@/helpers/checkMongoId'

@Controller('/message')
export default class MessageController {
  @Post('/')
  postMessage(@Body({ required: true }) message: MessageValidator) {
    checkMongoId(message.author, 'Invalid author ID')
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
    @Body({ required: true }) { text }: MessageValidator
  ) {
    return MessageModel.findOneAndUpdate({ _id: id }, { text }, { new: true })
  }
}
