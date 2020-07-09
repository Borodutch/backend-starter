import { Context } from 'koa'
import { getAllMessages, deleteMessage, updateMessage, createMessage } from '../models/message'
import { Controller, Post, Get, Delete, Put } from 'koa-router-ts'


@Controller('')
export default class {

  @Post('/addMsg')
  async createMessage(ctx: Context) {
    const msg = ctx.request.body;
    const message = await createMessage({
      title: msg.title,
      text: msg.text
    })
    ctx.body = message
  }

  @Put('/updateMsg')
  async updateMessage(ctx: Context) {
    const msg = ctx.request.body;
    const message = await updateMessage({
      text: msg.text,
      id: msg.id,
    })
    ctx.body = message
  }

  @Delete('/deleteMsg')
  async deleteMessage(ctx: Context) {
    const id = ctx.request.body.id;
    const message = await deleteMessage(id)
    ctx.body = message
  }

  @Get('/')
  async getMessages(ctx: Context) {
    const message = await getAllMessages()
    ctx.body = message
  }
}
