import { MessageModel } from '@/models/message'
import { auth } from '@/controllers/middlewares/auth'
import {
  Controller,
  Flow,
  Get,
  Post,
  Put,
  Delete,
  Body,
  CurrentUser,
} from 'amala'

@Controller('/')
export default class {
  @Post('/')
  @Flow(auth)
  async create(@Body('text') body) {
    const newMsg = new MessageModel({ text: body })
    await newMsg.save()
  }

  @Get('/:id')
  @Flow(auth)
  async read(@CurrentUser() user) {
    const someMsg = await MessageModel.findById(user.id)
    return someMsg
  }

  @Put('/:id')
  @Flow(auth)
  async update(@Body('text') body, @CurrentUser() user) {
    await MessageModel.findByIdAndUpdate(user.id, { text: body })
  }

  @Delete('/:id')
  @Flow(auth)
  async delete(@CurrentUser() user) {
    await MessageModel.findByIdAndDelete(user.id)
  }
}
