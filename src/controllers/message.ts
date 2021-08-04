import { Context } from 'koa'
import {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from '@/models/message'
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Params,
  Query,
  Body,
} from 'amala'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async create(
    @Params('id') id: string,
    @Body('text') text: string,
    @Query('author') author: Ref<User>
  ) {
    return await createMessage({ text, author })
  }

  @Get('/:id')
  async getOne(@Params('id') id: string) {
    return await getMessage(id)
  }

  @Get('/all')
  async getAll() {
    return await getAllMessages()
  }

  @Patch('/:id')
  async update(
    @Params('id') id: string,
    @Body('text') text: string,
    @Query('author') author: Ref<User>
  ) {
    const newMessageData = { text, author }
    return await updateMessage(id, newMessageData)
  }

  @Delete('/:id')
  async delete(@Params('id') id: string) {
    return await deleteMessage(id)
  }
}
