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
  Ctx,
} from 'amala'

@Controller('/')
export default class {
  @Post('/')
  @Flow(auth)
  async create(@Body('text') text, @CurrentUser() user, @Ctx() ctx) {
    await new MessageModel({ author: user, text }).save()
    ctx.status = 200
  }

  @Get('/')
  @Flow(auth)
  async getAll(@CurrentUser() user) {
    const messages = await MessageModel.find({ author: user })
    return messages
  }

  @Put('/:id')
  @Flow(auth)
  async update(
    @Body('text') text,
    @Params('id') id,
    @CurrentUser() user,
    @Ctx() ctx
  ) {
    await MessageModel.findOneAndUpdate({ _id: id, author: user }, { text })
    ctx.status = 200
  }

  @Delete('/:id')
  @Flow(auth)
  async delete(@Params('id') id, @CurrentUser() user, @Ctx() ctx) {
    await MessageModel.findOneAndDelete({
      _id: id,
      author: user,
    })
    ctx.status = 200
  }
}
