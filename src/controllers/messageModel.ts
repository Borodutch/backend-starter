import { Controller, Body, Ctx, Params, Post, Get, Put, Delete } from 'amala'
import { Context } from 'koa'
import mongoose from 'mongoose'

require('./CRUDmodel')
const Message_model = mongoose.model('message collection 333')

@Controller('/messages')
export default class MessageController {
  @Get('/')
  getAllMessages() {
    const message_m2 = Message_model.find({})
    console.log('read')
    return message_m2
  }

  @Post('/')
  addMessage(@Ctx() ctx: Context, @Body({ required: true }) body: any) {
    const message_m3 = new Message_model({ text_field: body })
    message_m3.save()
    console.log('created')
    return 'Message created'
  }

  @Delete('/:id')
  deleteMessage(@Ctx() ctx: Context, @Params('id') id: any) {
    Message_model.findByIdAndRemove({ _id: ctx.params.id }).then(() => {
      console.log('deleted')
    })
    return 'Message deleted'
  }

  @Put('/:id')
  editMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: any,
    @Params('id') id: any
  ) {
    Message_model.findByIdAndUpdate(
      { _id: ctx.params.id },
      { text_field: body }
    ).then(() => {
      console.log('updated')
    })
    return 'Message updated'
  }
}
