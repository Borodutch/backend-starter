import { Body, Controller, Delete, Get, Params, Post } from 'amala'
import CreateMessagesInput from '@/validators/CreateMessagesInput'
import MessagesModel from '@/models/messages'

@Controller('/messages')
class MessagesContrroller {
  @Get('/:id')
  getMessagesById(@Params('id') id: string) {
    return MessagesModel.findById(id)
  }

  @Post('/')
  createMessages(@Body({ required: true }) body: CreateMessagesInput) {
    return MessagesModel.create(body)
  }

  @Delete('/:id')
  async deleteMessages(@Params('id') id: string) {
    await MessagesModel.remove(id)
  }
}

export default MessagesContrroller
