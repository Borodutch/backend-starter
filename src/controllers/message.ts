import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Params,
  Post,
  Put,
} from 'amala'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageValidatorDefault from '@/validators/DefaultMessage'
import MessageValidatorDelete from '@/validators/DeleteMessage'
import MessageValidatorUpdate from '@/validators/UpdateMessage'
import auth from '@/middleware/auth'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  async addMessage(
    @CurrentUser({ required: true }) author: User,
    @Body({ required: true }) { text }: MessageValidatorDefault
  ) {
    return await (await MessageModel.create({ text, author })).save()
  }

  @Put('/')
  async updateMessage(
    @Body({ required: true }) { text, _id }: MessageValidatorUpdate
  ) {
    await MessageModel.findByIdAndUpdate(_id, { text })
    return await MessageModel.findById(_id)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') _id: MessageValidatorDelete) {
    return await MessageModel.findByIdAndDelete(_id)
  }

  @Post('/display-messages')
  async displayMessages() {
    return await MessageModel.find()
  }
}
