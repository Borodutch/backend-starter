import { Controller, Body, Get, Post, Put, Params, Delete } from 'amala'
import { MessageModel } from '@/models/Message'
import Message from '@/validators/Message'

@Controller('/message')
class MessageController {
  @Get('/')
  async getMessageList() {
    const allMessages = await MessageModel.find()
      .sort({ createdAt: -1 })
      .populate('author')
    return allMessages
  }

  @Post('/')
  async createMessage(@Body({ required: true }) message: Message) {
    const newMessage = new MessageModel(message)
    await newMessage.save()
  }

  @Put('/')
  async updateMessage(@Body({ required: true }) message: Message) {
    await MessageModel.findOneAndUpdate(
      { _id: message._id },
      { text: message.text },
      { new: true }
    )
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    await MessageModel.deleteOne({ _id: id })
  }
}
