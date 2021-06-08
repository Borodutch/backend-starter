import { Context } from 'koa'
import { createMessage, getAllMessages, getMessage, updateMessage, deleteMessage } from '@/models/message'
import { Controller, Ctx, Post, Get, Patch, Delete } from 'koa-ts-controllers'

@Controller('/message')
export default class MessageController {
  @Post('/message')
  async create(@Ctx() ctx: Context) {
    const message = createMessage({
      body: ctx.query.body,
      createdBy: ctx.query.createdBy
    })

    return message
  }

  @Get('/message/:id')
  async getOne(@Ctx() ctx: Context) {
    const message = await getMessage(ctx.params.id);

    return message
  }

  @Get('/messages')
  async getAll() {
    const messages: any = await getAllMessages()
    console.log('returned to controller')
    console.log(messages)
    return messages
  }

  @Patch('/message/:id')
  async update(@Ctx() ctx: Context) {
    const newMessageData = {
      body: ctx.query.body,
      createdBy: ctx.query.createdBy
    }
    const newMessage = await updateMessage(ctx.params.id, newMessageData)

    return newMessage
  }

  @Delete('/message/:id')
  async delete(@Ctx() ctx: Context) {
    const message = await deleteMessage(ctx.params.id)

    return message
  }
} 

