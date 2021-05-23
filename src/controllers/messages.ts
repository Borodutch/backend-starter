import { Body, Controller, Get, Post, Put, Delete, Flow } from 'koa-ts-controllers'
import authMiddleware from '@/middleware/authMiddleware';
import { MessageModel } from '@/models/message';

@Controller('/messages')
@Flow([ authMiddleware ]) // // for Users only
export default class MesagesController {
  @Get('/')
  async listMessages() {    
    return await MessageModel.find()
  }

  @Post('/')
  async postMessage(
    @Body('content') content: string  
  ) {
    const message = await new MessageModel({
      content
    }).save()
    return { 
      response: 'message posted',
      message
    }
  }

  @Put('/')
  async updateMessage(
    @Body('_id') _id: string,
    @Body('content') content: string
  ) {
    const message = await MessageModel.findById(_id)
    message.content = content 
    
    return {
      response: 'message updated',
      message: await message.save()
    }
  }

  @Delete('/')
  async deleteMessage(
    @Body('_id') _id: string
  ) {
    await MessageModel.deleteOne({ _id })
    return {
      response: 'message deleted',
    }
  }
}