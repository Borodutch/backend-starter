import { Context } from 'koa'
import { Message } from '@/models/message'
import { Controller, Ctx, Post, Get, Patch, Delete } from 'koa-ts-controllers'

@Controller('/message')
export default class MessageController {
  @Post('/message')
  async createMessage(@Ctx() ctx: Context) {
    const message = new Message({
      body: ctx.query.body,
      createdBy: ctx.query.createdBy
    })

    await message.save()
      .then((result) => {
        ctx.body = result
      })
      .catch((err) => {
        console.log(err) 
      })
  }

  @Get('/message/:id')
  async getMessage(@Ctx() ctx: Context) {
    await Message.findById(ctx.params.id)
      .then((result) => {
        ctx.body = result
      })
      .catch((err) => {
        console.log(err)
      })
  }

  @Get('/messages')
  async getAllMessages(@Ctx() ctx: Context) {
    await Message.find()
      .then((result) => {
        ctx.body = result
      })
      .catch((err) => {
        console.log(err)
      })
  }

  @Patch('/message/:id')
  async updateMessage(@Ctx() ctx: Context) {
    const message = await Message.findById(ctx.params.id)
      if (ctx.query.body) {
        message.body = ctx.query.body
      }
      if (ctx.query.createdBy) {
        message.createdBy = ctx.query.createdBy
      }
      
    message.save()
      .then((result) => {
        ctx.body = result
      })
      .catch((err) => {
        console.log(err) 
      })
  }

  @Delete('/message/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    await Message.findByIdAndDelete(ctx.params.id)
      .then((result) => {
        ctx.body = `You just deleted a message with id ${ctx.params.id}`
      })
      .catch((err) => {
        console.log(err)
      })
  }
} 

