import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import MessageModel from '@/models/MessageModel'
import MessageValidator from '@/validators/MessageValidator'
import UserValidator from '@/validators/UserValidator'
import findMessage from '@/helpers/findMessage'
import userVerificator from '@/helpers/userVerificator'

@Controller('/message')
@Flow([userVerificator])
export default class MessageController {
  @Post('/')
  postMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: UserValidator
  ) {
    return MessageModel.create({ author, text })
  }

  @Delete('/:id')
  async deleteMessage(
    @Params('id') id: string,
    @CurrentUser() { _id }: UserValidator
  ) {
    const message = await findMessage(id, _id)
    return message.delete()
  }

  @Get('/')
  getMessages(@CurrentUser() { _id }: UserValidator) {
    return MessageModel.find({ author: _id })
  }

  @Get('/:id')
  getMessage(@Params('id') id: string, @CurrentUser() { _id }: UserValidator) {
    return findMessage(id, _id)
  }

  @Put('/:id')
  async updateMessage(
    @Params('id') id: string,
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() { _id }: UserValidator
  ) {
    const message = await findMessage(id, _id)
    message.text = text
    return message.save()
  }
}
