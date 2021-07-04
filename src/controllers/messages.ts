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
  Query,
  IsArray,
} from 'amala'
import {
  createMessage,
  getMessage,
  getAllMessages,
  deleteMessages,
  deleteOneMessage,
  changeMessage,
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

class MessagesDeleteInput {
  @IsArray()
  id: string[]
}

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getUserMessages() {
    return await getAllMessages()
  }

  @Get('/:id')
  async getUserMessage(@Params('id') id: string) {
    return await getMessage(id)
  }

  @Post('/')
  async addUserMessage(@Body({ required: true }) body: MessageAddInput) {
    return await createMessage(body.message)
  }

  @Delete('/:id')
  async deleteOneUserMessage(@Params('id') id: string) {
    return await deleteOneMessage(id)
  }

  @Delete('/')
  async deleteUserMessages(
    @Ctx() ctx: Context,
    @Query({ required: true }) query: MessagesDeleteInput
  ) {
    return await deleteMessages(query.id)
  }

  @Put('/')
  async changeUserMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: MessageChangeInput
  ) {
    return await changeMessage(body.id, body.message)
  }
}
