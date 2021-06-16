import { Context } from 'koa'
import {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from '@/models/message'
import { Controller, Ctx, Post, Get, Patch, Delete } from 'koa-ts-controllers'

export default class MessageController {
  @Post('/message')
  async create(@Ctx() ctx: Context) {
    try {
      const message = await createMessage({
        body: ctx.query.body,
        createdBy: ctx.query.createdBy,
      })
      return message
    } catch (err) {
      console.log(err)
    }
  }

  @Get('/message/:id')
  async getOne(@Ctx() ctx: Context) {
    try {
      const message = await getMessage(ctx.params.id)
      return message
    } catch (err) {
      console.log(err)
    }
  }

  @Get('/messages')
  async getAll() {
    try {
      const messages: any = await getAllMessages()
      return messages
    } catch (err) {
      console.log(err)
    }
  }

  @Patch('/message/:id')
  async update(@Ctx() ctx: Context) {
    const newMessageData = {
      body: ctx.query.body,
      createdBy: ctx.query.createdBy,
    }
    try {
      const newMessage = await updateMessage(ctx.params.id, newMessageData)
      return newMessage
    } catch (err) {
      console.log(err)
    }
  }

  @Delete('/message/:id')
  async delete(@Ctx() ctx: Context) {
    try {
      const message = await deleteMessage(ctx.params.id)
      return message
    } catch (err) {
      console.log(err)
    }
  }
}
