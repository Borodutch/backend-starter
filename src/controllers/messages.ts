import {
  Ctx,
  Controller,
  Params,
  Delete,
  Get,
  Post,
  Put,
  Body,
  IsString,
  IsArray,
  Flow,
  CurrentUser,
} from 'amala'
import { Context } from 'koa'
import {
  createMessage,
  getMessage,
  getAllMessages,
  deleteOneMessage,
  changeMessage,
} from '@/models/message'
import { authUser } from '@/middlewares/authUser'
import { User } from '@/models/user'

class MessageChangeInput {
  @IsString()
  id: string

  @IsString()
  message: string
}

class MessageAddInput {
  @IsString()
  message: string
}

@Flow(authUser)
@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllUserMessages(@Ctx() ctx: Context, @CurrentUser() user: User) {
    const messages = await getAllMessages(user)
    if (messages.length > 0) return messages
    else ctx.throw(404, 'messages not found')
  }

  @Get('/:id')
  async getUserMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User
  ) {
    const message = await getMessage(id, user)
    if (message.length > 0) return message
    else ctx.throw(404, 'message not found')
  }

  @Post('/')
  async addUserMessage(
    @Body({ required: true }) body: MessageAddInput,
    @CurrentUser() user: User
  ) {
    return await createMessage(body.message, user)
  }

  @Delete('/:id')
  async deleteOneUserMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User
  ) {
    const message = await deleteOneMessage(id, user)
    if (message) return message
    else ctx.throw(404, 'message not found')
  }

  @Put('/')
  async changeUserMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: MessageChangeInput,
    @CurrentUser() user: User
  ) {
    const message = await changeMessage(body.id, body.message, user)
    console.log(message)
    if (message) return message
    else ctx.throw(404, 'message not found')
  }
}
