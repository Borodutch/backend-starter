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

  @Get('/messagee')
  async getOne(ctx: Context) {
    ctx.body = 'YES it is WORK!!!!!!'
  }

  @Post('/post')
  async post(ctx: Context) {
    const message = new MessageModel()
    message.message = ctx.request.body.message
    await message.save()
    ctx.body = { status: 'Message Posted!' }
  }

  @Delete('/delete/:id')
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
