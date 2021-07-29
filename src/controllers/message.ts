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
import { MessageModel } from '@/models/message'
import { authVerify } from '@/middleware/auth'
import { authorCheck } from '@/middleware/authorCheck'
import { User } from '@/models/user'

@Controller('/message')
@Flow(authVerify)
export default class MessageController {
  @Get('/')
  async showMessages(@CurrentUser() author: User) {
    return await MessageModel.find({ author })
  }

  @Post('/add')
  async addMessage(@CurrentUser() author: User, @Body('message') text: string) {
    return await MessageModel({ author, text }).save()
  }

  @Delete('/:id')
  @Flow(authorCheck)
  async deleteMessage(@Params('id') id: string) {
    return await MessageModel.findByIdAndDelete(id)
  }

  @Put('/:id')
  @Flow(authorCheck)
  async editMessage(@Params('id') id: string, @Body('message') text: string) {
    return await MessageModel.findByIdAndUpdate(id, { text })
  }
}
