import  Message  from '../models/message';
import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'

@Controller('/message')
export default class MessageController {
  
  // Create message. 
  //   {
  //     "title": "Message Title",
  //     "body": "Message Body",
  //     "user": "Message Author User id"
  // }
  @Post('/')
    async createMessage(@Ctx() ctx: any){
      const messageProps: any = ctx.request.body
      let createdMessage = await new Message(messageProps)
      return createdMessage.save().then(message => message.populate('user').execPopulate())
  }

  // Get message by id
  // Get id from URL
  @Get('/:id')
    async getMessage(@Params() params: any){
      const id = params.id
      const message = await Message.findById(id)
      return message
    }

  // Update message
  // {
  //   "title": "Message Title",
  //   "body": "Message Body"
  // }
  @Put('/:id')
    async updateMessage(@Ctx() ctx: Context){
      const id = ctx.originalUrl.split('/')[2]
      const messageProps: any = ctx.request.body
      await Message.findByIdAndUpdate(id, {$set: messageProps}, {new: true}, (err, updatedMessage) => {
        if(err){
          console.log(err)
        }
        console.log(updatedMessage)
      })
    }

  // Delete message by id
  // Get id from URL
  @Delete('/:id')
    async deleteMessage(@Params() params: any){
      const id = params.id
      await Message.findByIdAndDelete(id)
        .then((deleteMessage) => {
          console.log(deleteMessage)
        })
        .catch((err) => {
          console.log(err)
        })
    }
}