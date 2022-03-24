import { Body, Controller, Delete, Get, Params, Post } from 'amala'
import MessagesModel from '@/models/messages.model'
import createMessagesInput from '@/validators/messages.validator'

@Controller('/messages')
class MessagesContrroller {
  @Get('/:id')
  getMessagesById(@Params('id') id: string) {
    return MessagesModel.findById(id)
  }

  @Post('/')
  createMessages(@Body({ required: true }) body: createMessagesInput) {
    return MessagesModel.create(body)
  }

  @Delete('/:id')
  async deleteMessages(@Params('id') id: string) {
    await MessagesModel.remove(id)
  }
}

export default MessagesContrroller
