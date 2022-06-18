import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import { messageModel } from '@/models/messageModel'

@Controller('/homePage')
export default class MessageController {
  @Post('/')
  PostMessage(@Body({ required: true }) body: any) {
    const user = messageModel.create({
      user: body.user,
      message: body.message,
    })
    return user
  }
  @Get('/')
  getMessages() {
    const user = messageModel.find({})
    return user
  }
  @Delete('/:id')
  deleteMessage(@Params('id') id: any) {
    const user = messageModel.findByIdAndDelete(id)
    return user
  }
  @Put('/:id')
  updateMessage(@Params('id') id: any, @Body({ required: true }) body: any) {
    const user = messageModel.findByIdAndUpdate(id, {
      message: body.message,
    })
    return user
  }
}
