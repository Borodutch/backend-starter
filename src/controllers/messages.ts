import { Body, Controller, Delete, Get, Params, Post } from 'amala'
import {
  editById,
  findOrCreateMessage,
  getAll,
  getById,
  removeById,
} from '@/models/Messages'

@Controller('/')
export default class StatusController {
  @Post('messages')
  async add(@Body() body: { message: string }) {
    try {
      const message = await findOrCreateMessage({
        message: body.message,
      })
      return message
    } catch (err) {
      console.log(err)
    }
  }
  @Get('messages')
  async getAllMessages() {
    try {
      const messages = await getAll()
      return messages
    } catch (err) {
      console.log(err)
    }
  }

  @Get('messages/:id')
  async getMessageById(@Params('id') id: string) {
    try {
      const messages = await getById(id)
      return messages
    } catch (err) {
      console.log(err)
    }
  }

  @Delete('messages/:id')
  async delete(@Params('id') id: string) {
    const messages = await removeById(id)
    return messages
  }
  @Post('messages/:id')
  async editMessage(
    @Params('id') id: string,
    @Body() body: { message: string }
  ) {
    await editById(id, body)
    return 'messages is edited'
  }
}
