import { MessageModel } from '@/models/message'
import { auth } from '@/controllers/middlewares/auth'
import { Controller, Flow, Get, Post, Put, Delete, Params, Body } from 'amala'

@Controller('/')
export default class {
  @Post('/auth')
  @Flow(auth)

  @Post('/')
  async create(@Body() body) {
    const newMsg = new MessageModel({ text: body })
    await newMsg.save()
  }

  @Get('/:id')
  async read(@Params('id') id) {
    const someMsg = await MessageModel.findById(id)
    return someMsg
  }

  @Put('/:id')
  async update(@Body() body, @Params('id') id) {
    await MessageModel.findByIdAndUpdate(id, { text: body })
  }

  @Delete('/:id')
  async delete(@Params('id') id) {
    await MessageModel.findByIdAndDelete(id)
  }
}
