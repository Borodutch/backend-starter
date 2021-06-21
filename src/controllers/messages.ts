import { MessageModel } from '@/models/message'
import { Controller, Get, Post, Put, Delete, Params, Body } from 'amala'

@Controller('/message')
export default class {
  @Post('/create')
  async create(@Body() body) {
    const newMsg = new MessageModel(body)
    await newMsg.save()
  }

  @Get('/read/:id')
  async read(@Params('id') id) {
    const someMsg = await MessageModel.findById(id)
    return someMsg
  }

  @Put('/update/:id')
  async update(@Body() body, @Params('id') id) {
    await MessageModel.findByIdAndUpdate(id, {
      message: body,
    })
  }

  @Delete('/delete/:id')
  async delete(@Params('id') id) {
    await MessageModel.findByIdAndDelete(id)
  }
}
