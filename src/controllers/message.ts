import { Body, Controller, Delete, Get, Patch, Post } from 'amala'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(@Body({ required: true }) author: Ref<User>, text: string) {
    return await createMessage(author, text)
  }
  @Get('/')
  async getMessages(@Body({ required: true }) author: Ref<User>) {
    return await getMessages(author)
  }
  @Delete('/')
  async deleteMessage(@Body('id') id: string) {
    return await deleteMessage(id)
  }
  @Patch('/')
  async updateMessages(
    @Body('text') updatedText: string,
    @Body('id') id: string
  ) {
    return await updateMessage(id, updatedText)
  }
}
