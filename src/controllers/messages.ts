import {
  Controller,
  Ctx,
  Params,
  Delete,
  Get,
  Post,
  Put,
  Body,
  IsString,
} from 'amala'
import {
  createUserMessage,
  getUserMessage,
  deleteUserMessage,
  changeUserMessage,
} from '@/models/message'

import { Context } from 'koa'

// Validator classes
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

@Controller('/messages')
export default class MessageController {
  //get all messages
  @Get('/')
  async getAllMessages() {
    return await getUserMessage()
  }
  //get message
  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    return await getUserMessage(id)
  }
  //add new massage
  @Post('/')
  async addMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: MessageAddInput
  ) {
    return (ctx.response.body = await createUserMessage(body.message))
  }
  //delete message
  @Delete('/')
  async deleteMessage(@Ctx() ctx: Context) {
    const id = <string[]>ctx.request.query.id
    if (id) {
      return (ctx.response.body = await deleteUserMessage(id))
    } else {
      return (ctx.response.status = 400)
    }
  }
  //change message
  @Put('/')
  async changeMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: MessageChangeInput
  ) {
    return (ctx.response.body = await changeUserMessage(body.id, body.message))
  }
}
