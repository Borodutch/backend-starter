import { Body, Controller, Delete, Get, Params, Post } from 'amala'
import CreateMessagesInput from '@/validators/CreateMessagesInput'
import MessagesModel from '@/models/messages'

@Controller('/messages')
class MessagesContrroller {
  @Get('/:id')
  getMessagesById(@Params('id') id: CreateMessagesInput) {
    return MessagesModel.findById(id)
  }

  @Post('/')
  createMessages(@Body({ required: true }) { text }: CreateMessagesInput) {
    return MessagesModel.create({ text })
  }

  @Delete('/:id')
  async deleteMessages(@Params('id') id: CreateMessagesInput) {
    await MessagesModel.remove(id)
  }
}

export default MessagesContrroller
