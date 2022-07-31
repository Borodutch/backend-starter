import {
  Body,
  Controller,
  Delete,
  Get,
  Params,
  Post,
  Put,
  Flow,
  CurrentUser,
} from 'amala'
import { Message, IdMessage } from '@/validators/Message'
import MessageModel from '@/models/Message'
import isAuthor from '@/middleware/isAuthor'
import auth from '@/middleware/auth'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Get('/')
  async getMessages(@CurrentUser() user: any) {
    return MessageModel.find({ author: user })
  }

  @Post('/')
  async createMessages(
    @CurrentUser() author: {},
    @Body({ required: true }) { text }: Message
  ) {
    await new MessageModel({ text, author }).save()
  }

  @Put('/:id')
  @Flow(isAuthor)
  async updateMessages(
    @Body({ required: true }) { text }: Message,
    @Params() { id }: IdMessage
  ) {
    const updateMessage = await MessageModel.findOneAndUpdate(
      { _id: id },
      { text: text },
      { returnDocument: 'after' }
    )
    return updateMessage
  }

  @Delete('/:id')
  @Flow(isAuthor)
  async deleteMessages(@Params() { id }: IdMessage) {
    const deleteMessage = await MessageModel.findByIdAndDelete({ _id: id })
    return deleteMessage
  }
}
