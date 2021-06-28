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
    return await getMessages().catch(({ statusCode, message }) => {
      ctx.throw(statusCode, JSON.stringify({ message }))
    })
  }

  @Post('/add')
  async messageAdd(@Ctx() ctx: Context, @Body() addData: string) {
    await createMessage(addData).catch(({ statusCode, message }) => {
      ctx.throw(statusCode, JSON.stringify({ message }))
    })
  }

  @Get('/:id')
  async showSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: string
  ) {
    return await findMessageById(messageId).catch(({ statusCode, message }) => {
      ctx.throw(statusCode, JSON.stringify({ message }))
    })
  }

  @Delete('/:id')
  async deleteSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: string
  ) {
    await deleteMessageById(messageId).catch(({ statusCode, message }) => {
      ctx.throw(statusCode, JSON.stringify({ message }))
    })
  }

  @Put('/:id')
  async updateSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: any,
    @Body() putData: string
  ) {
    await updateMessage(messageId, putData).catch(({ statusCode, message }) => {
      ctx.throw(statusCode, JSON.stringify({ message }))
    })
  }
}
