import { Controller, Body, Get, Post, Put, Params, Delete } from 'amala'
import { MessageModel, AuthorModel } from '@/models/Message'

@Controller('/message')
class MessageController {
  @Get('/all')
  async getMessageList() {
    const allMessages = await MessageModel.find()
      .sort({ createdAt: -1 })
      .populate('author')
    return allMessages
  }

  @Post('/')
  async createMessage(@Body({ required: true }) message: any) {
    const newMessage = new MessageModel(message)
    await newMessage.save()
  }

  @Post('/author')
  async createAuthor(@Body({ required: true }) message: any) {
    const newAuthor = new AuthorModel(message)
    await newAuthor.save()
  }

  @Put('/')
  async updateMessage(@Body({ required: true }) message: any) {
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
