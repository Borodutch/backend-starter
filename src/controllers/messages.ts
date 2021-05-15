import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { Controller, Ctx, Req, Body, Get, Post, Delete, Query, Flow, Params, Version, CurrentUser } from 'koa-ts-controllers'
import { result } from 'lodash'

@Controller('/messages')
export default class MessageController {
  // Add new message
  @Post('/messageCreate')
  async messageCreate(@Body() leadData: any) {
    const newMessage = await new MessageModel(leadData).save()
    return newMessage
  }
  
  // List of all messages
  @Get('/messagesList')
  async messagesList(@Ctx() ctx: Context) {
    MessageModel.find()
      .then((result) => {
        console.log('All messages:', result);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // Read (find) message by ID
  @Get('/:id')
  async messageRead(@Params() params: any) {
    const id = params.id

    MessageModel.findById(id)
      .then((result) => {
        console.log('Result of searching:', result)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // Update message by ID
  @Post('/:id')
  async messageUpdate(@Params() params: any, @Body() leadData: any) {
    const id = params.id
    
    MessageModel.findByIdAndUpdate(id, leadData)
      .then((result) => {
        console.log('Message updated');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // Delete message by ID
  @Delete('/:id')
  async messageDelete(@Params() params: any) {
    const id = params.id
    MessageModel.findByIdAndDelete(id)
      .then((result) => {
        console.log('Message deleted');
      })
      .catch((err) => {
        console.log(err);
      })
  }
}
