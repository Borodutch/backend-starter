import { auth, userVerify } from '@/middlewares/auth'
import {
  createMessage,
  getMessages,
  findMessageById,
  deleteMessageById,
  updateMessage,
} from '@/models/message'
import { User } from '@/models/user'
import { Ref } from '@typegoose/typegoose'
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
  CurrentUser,
} from 'amala'
import { Context } from 'koa'

@Controller('/messages')
@Flow(auth)
class MessageController {
  @Get('/')
  async messageList(@CurrentUser() author: Ref<User>) {
    return await getMessages(author)
  }

  @Post('/add')
  async messageAdd(
    @Body('text') text: string,
    @CurrentUser() author: Ref<User>
  ) {
    await createMessage(text, author)
  }

  @Get('/:id')
  async showSingleMessage(
    @Params('id') messageId: string,
    @CurrentUser() user: Ref<User>,
    @Ctx() ctx: Context
  ) {
    if (await userVerify(messageId, user)) {
      return await findMessageById(messageId)
    } else {
      ctx.throw(400, 'User is not is not allowed to view this message')
    }
  }

  @Delete('/:id')
  async deleteSingleMessage(
    @Params('id') messageId: string,
    @CurrentUser() user: Ref<User>,
    @Ctx() ctx: Context
  ) {
    if (await userVerify(messageId, user)) {
      return await deleteMessageById(messageId)
    } else {
      ctx.throw(400, 'User is not allowed to delete this message')
    }
  }

  @Put('/:id')
  async updateSingleMessage(
    @Ctx() ctx: Context,
    @Params('id') messageId: any,
    @Body('text') text: string,
    @CurrentUser() user: Ref<User>
  ) {
    if (await userVerify(messageId, user)) {
      return await updateMessage(messageId, text)
    } else {
      ctx.throw(400, 'User is not allowed to alter this message')
    }
  }
}
