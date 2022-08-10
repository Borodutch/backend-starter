import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
} from 'amala'
import { MessageModel } from '@/models/Message'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'
import authMiddleware from '@/middleware/authMiddleware'

@Controller('/message')
export default class MessageController {
  @Post('/create')
  @Flow([authMiddleware])
  create(
    @Body({ required: true }) text: string,
    @CurrentUser({ required: true }) author: Ref<User>
  ) {
    return MessageModel.create({ text, author })
  }
}
