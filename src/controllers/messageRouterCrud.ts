import { Controller, Body, Get, Post, Put, Params, Delete } from 'amala'
import { MessageModel } from '@/models/Message'

@Controller('/message')
class MessageController {
  @Get('/all')
  async getMessageList() {
    const allMessages = await MessageModel.find().sort({ createdAt: -1 })
    return allMessages
  }

  @Post('/post')
  async createMessage(@Body({ required: true }) message: any) {
    const newMessage = new MessageModel(message)
    await newMessage.save()
  }

  @Put('/post')
  async updateMessage(@Body({ required: true }) message: any) {
    await MessageModel.findOneAndUpdate(
      { _id: message._id },
      { text: message.text },
      { new: true }
    )
  }

  @Delete('/post/:id')
  async deleteMessage(@Params('id') id: string) {
    await MessageModel.deleteOne({ _id: id })
  }
}
