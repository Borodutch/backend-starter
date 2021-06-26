import {
  createMessage,
  getMessages,
  findMessageById,
  deleteMessageById,
  updateMessage,
} from '@/models/message'
import {
  Controller,
  Ctx,
  Get,
  Post,
  Delete,
  Flow,
  Params,
  Put,
  Body,
} from 'amala'
import { Context } from 'koa'

@Controller('/messages')
class messageController {
  @Get('/')
  async messageList(@Ctx() ctx: Context) {
    try {
      return await getMessages()
    } catch (error) {
      console.log(error)
    }
  }
  @Post('/add')
  async messageAdd(@Body() addData: string) {
    try {
      createMessage(addData)
    } catch (error) {
      console.log(error)
    }
  }
  @Get('/:id')
  async showSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: string
  ) {
    try {
      return findMessageById(messageId)
    } catch (error) {
      console.log(error)
    }
  }
  @Delete('/:id')
  async deleteSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: string
  ) {
    try {
      await deleteMessageById(messageId)
    } catch (error) {
      console.log(error)
    }
  }
  @Put('/:id')
  async updateSingleMessage(
    @Params('id') messageId: any,
    @Body() putData: string
  ) {
    try {
      await updateMessage(messageId, putData)
    } catch (error) {
      console.log(error)
    }
  }
}
