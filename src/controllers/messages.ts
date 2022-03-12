import { Body, Controller, Delete, Get, Params, Post } from 'amala'
import {
  editById,
  findOrCreateMessage,
  getAll,
  getById,
  removeById,
} from '@/models/Messages'
import MessageValid from '@/validators/MessageValid'

@Controller('/messages')
export default class StatusController {
  @Post('')
  async add(@Body() { message }: MessageValid) {
    try {
      const messages = await findOrCreateMessage({
        message: message,
      })
      return messages
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
  async deleteMessage(@Params('id') id: string) {
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
