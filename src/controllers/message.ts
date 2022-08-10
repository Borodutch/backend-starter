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
import AuthorValid from '@/validators/AuthorValid'
import authMiddleware from '@/middleware/authMiddleware'

@Controller('/message')
export default class MessageController {
  @Post('/create')
  @Flow([authMiddleware])
  create(
    @Body({ required: true }) text: string,
    @CurrentUser({ required: true }) author: AuthorValid
  ) {
    console.log(author)
    // const messageData = { text, author }
    // return MessageModel.create(messageData)
  }

  //   @Get('/:id')
  //   getMessageById(@Params({ required: true }) id: string) {
  //     return id
  //   }

  //   @Delete('/:id')
  //   deleteMessageById(@Params() params: any) {
  //     this.deleteMessageById(params.id)
  //   }
  // }
}
