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
class MessageController {
  @Get('/')
  async messageList(@Ctx() ctx: Context) {
    return await getMessages()
  }

  @Post('/add')
  async messageAdd(@Body() addData: string) {
    await createMessage(addData)
  }

  @Get('/:id')
  async showSingleMessage(@Params('id') messageId: string) {
    return await findMessageById(messageId)
  }

  @Delete('/:id')
  async deleteSingleMessage(
    // @Ctx() ctx: Context,
    @Params('id') messageId: string
  ) {
    await deleteMessageById(messageId)
  }

  @Put('/:id')
  async updateSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: any,
    @Body() putData: string
  ) {
    await updateMessage(messageId, putData)
  }
}
