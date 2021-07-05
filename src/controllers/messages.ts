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
  Params,
} from 'amala'

@Controller('/')
export default class {
  @Post('/')
  @Flow(auth)
  async create(@Body('text') text, @CurrentUser() user) {
    const message = await new MessageModel({ author: user, text }).save()
    return { newMessage: message.text }
  }

  @Get('/')
  @Flow(auth)
  async getAll(@CurrentUser() user) {
    const messages = await MessageModel.find({ author: user })
    const texts = messages.map((item) => {
      return item.text
    })
    return { texts }
  }

  @Put('/:id')
  @Flow(auth)
  async update(@Body('text') text, @Params('id') id) {
    const message = await MessageModel.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    )
    return { updatedMessage: message.text }
  }

  @Delete('/:id')
  @Flow(auth)
  async delete(@Params('id') id) {
    const message = await MessageModel.findByIdAndDelete(id)
    return { deletedMessage: message.text }
  }
}
