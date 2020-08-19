import { Controller, Post, Get, Delete, Put } from 'koa-router-ts'
import { Context } from 'koa'
import { MessageModel } from '../models/message'

@Controller()
export default class {
  @Get('/messages')
  async get(ctx: Context) {
    const messages = await MessageModel.find().sort({ createdAt: -1 })
    ctx.body = messages
  }

  @Post('/message')
  async post(ctx: Context) {
    const data = ctx.request.body
    const message = new MessageModel({
      message: data.message,
      user: data.user,
    })
    await message.save()
    ctx.body = data
  }

  @Get('/message/:id')
  async getMessage(ctx: Context) {
    const message = await MessageModel.find({ user: ctx.params.id }).sort({
      createdAt: -1,
    })
    ctx.body = message
  }

  @Delete('/message/:id')
  async delete(ctx: Context) {
    await MessageModel.deleteOne({ _id: ctx.params.id })
    ctx.body = { status: 'Message Deleted!' }
  }

  @Put('/update/:id')
  async update(ctx: Context) {
    await MessageModel.findOneAndUpdate(
      { _id: ctx.params.id },
      { message: ctx.request.body.message }
    )
    ctx.body = { status: 'Message Updated!' }
  }
}
