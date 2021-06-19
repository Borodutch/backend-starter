import { Context } from 'koa'
import {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from '@/models/message'
import { Controller, Post, Get, Patch, Delete, Params, Query } from 'amala'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async create(
    @Params('id') id: string,
    @Query('body') body: string,
    @Query('createdBy') createdBy: string
  ) {
    try {
      return await createMessage({ body, createdBy })
    } catch (err) {
      console.log(err)
    }
  }

  @Get('/:id')
  async getOne(@Params('id') id: string) {
    try {
      return await getMessage(id)
    } catch (err) {
      console.log(err)
    }
  }

  @Get('/all')
  async getAll() {
    try {
      return await getAllMessages()
    } catch (err) {
      console.log(err)
    }
  }

  @Patch('/:id')
  async update(
    @Params('id') id: string,
    @Query('body') body: string,
    @Query('createdBy') createdBy: string
  ) {
    const newMessageData = { body, createdBy }
    try {
      return await updateMessage(id, newMessageData)
    } catch (err) {
      console.log(err)
    }
  }

  @Delete('/:id')
  async delete(@Params('id') id: string) {
    try {
      return await deleteMessage(id)
    } catch (err) {
      console.log(err)
    }
  }
}
