import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'
import { Context } from 'koa'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'

import MessageValidators from '@/validators/Message'

import authenticationUser from '@/middleware/authenticationUser'
import verifyUser from '@/middleware/verifyUser'

@Controller('/message')
@Flow(authenticationUser)
export default class MessageController {
  @Post('/')
  async create(
    @Body({ required: true }) { text }: Message,
    @CurrentUser() author: User
  ) {
    return await MessageModel.create({ text, author })
  }

  @Flow(verifyUser)
  @Get('/:id')
  async get(@State('message') message: Message) {
    return await MessageModel.findById(message)
  }

  @Flow(verifyUser)
  @Put('/:id')
  async update(
    @Body({ required: true }) { text }: MessageValidators,
    @State('message') message: Message
  ) {
    await MessageModel.findByIdAndUpdate(message, { text })
    return MessageModel.findById(message)
  }

  @Flow(verifyUser)
  @Delete('/:id')
  async delete(@State('message') message: Message) {
    return await MessageModel.findByIdAndDelete(message)
  }
}
