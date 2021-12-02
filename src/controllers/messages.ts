import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
} from 'amala'
import { MessageModel } from '@/models/message'
import { User } from '@/models/user'
import auth from '@/middlewares/auth'
import checkUser from '@/middlewares/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  async postMessage(
    @Body('message') message: string,
    @CurrentUser() username: User
  ) {
    return await new MessageModel({ message, username }).save()
  }

  @Get('/:id')
  @Flow(checkUser)
  async getMessage(
    @Body('message') message: string,
    @CurrentUser() username: User
  ) {
    return await MessageModel.find({ message, username })
  }

  @Put('/:id')
  @Flow(checkUser)
  async editMessage(@Body('id') id: string) {
    return await MessageModel.updateOne({ id })
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Body('id') id: string) {
    await MessageModel.findByIdAndDelete({ id })
    return { success: true }
  }
}
