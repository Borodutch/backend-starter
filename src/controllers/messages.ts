import { Body, Controller, CurrentUser, Delete, Get, Post, Put } from 'amala'
import { MessageModel } from '@/models/message'
import { User } from '@/models/user'

@Controller('/message')
export default class messageController {
  @Post('/')
  async postMessage(
    @Body('message') message: string,
    @CurrentUser() username: User
  ) {
    return await new MessageModel({ message, username }).save()
  }

  @Get('/:id')
  async getMessage(
    @Body('message') message: string,
    @CurrentUser() username: User
  ) {
    return await MessageModel.find({ message, username })
  }

  @Put('/:id')
  async editMessage(@Body('id') id: string) {
    return await MessageModel.updateOne({ id })
  }

  @Delete('/:id')
  async deleteMessage(@Body('id') id: string) {
    await MessageModel.findByIdAndDelete({ id })
    return { success: true }
  }
}
