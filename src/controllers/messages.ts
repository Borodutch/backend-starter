import { Context } from 'koa'
import {
  createMessage,
  findMessageByUserId,
  deleteMessage,
  updateMessage,
  findUpdatedMessage,
} from '../models/messages'
import { Controller, Post, Get, Put, Delete } from 'koa-router-ts'

@Controller('/message')
export default class {
  @Get('/get/:user')
  async getMessage(ctx: Context) {
    ctx.body = await findMessageByUserId(ctx.params.user)
  }

  @Post('/add/:userId')
  async addMessage(ctx: Context) {
    ctx.body = await createMessage(ctx.params.userId, ctx.query.content)
  }

  @Put('/update/:id')
  async updateById(ctx: Context) {
    await updateMessage({ _id: ctx.params.id }, ctx.query)
    ctx.body = await findUpdatedMessage({ _id: ctx.params.id })
  }

  @Delete('/delete/:id')
  async deleteById(ctx: Context) {
    const entry = await deleteMessage({
      _id: ctx.params.id,
    })
    ctx.body = `Just deleted the message: ${entry}`
  }
}
