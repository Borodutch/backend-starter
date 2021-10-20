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
import { User } from '@/models/user'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  @Flow(checkUser)
  async createMessage(
    @Body('newMessage') text: string,
    @CurrentUser() author: User
  ) {
    await MessageModel.create({ text, author })
    return { success: true }
  }

  @Get('/:id')
  @Flow(checkUser)
  async getMessages(@Params('id') id: string) {
    return await MessageModel.findById(id)
  }

  @Put('/:id')
  @Flow(checkUser)
  async updateMessage(
    @Params('id') id: string,
    @Body('newMessage') text: string
  ) {
    await MessageModel.findByIdAndUpdate(id, { text })
    return { success: true }
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Params('id') id: string) {
    await MessageModel.findByIdAndDelete(id)
    return { success: true }
  }
}
