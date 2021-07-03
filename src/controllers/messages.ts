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
  async create(
    @Body('author') author,
    @Body('text') text,
    @CurrentUser() user
  ) {
    let thisuser = await MessageModel.findById(user._id)
    thisuser.author = author
    thisuser.text = text
    await thisuser.save()

    return thisuser
  }

  @Get('/:id')
  @Flow(auth)
  async read(@CurrentUser() user) {
    const thisuser = await MessageModel.findById(user._id)
    return thisuser
  }

  @Put('/:id')
  @Flow(auth)
  async update(
    @Body('author') author,
    @Body('text') text,
    @CurrentUser() user
  ) {
    const thisuser = await MessageModel.findByIdAndUpdate(
      user._id,
      { author, text },
      { new: true }
    )
    return thisuser
  }

  @Delete('/:id')
  @Flow(auth)
  async delete(@CurrentUser() user) {
    const thisuser = await MessageModel.findByIdAndDelete(user._id)
    return thisuser + '  deleted'
  }
}
