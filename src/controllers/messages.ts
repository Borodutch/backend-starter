import { Context } from 'koa'
import {
  createMessage,
  findMessageByUsername,
  deleteMessage,
  updateMessage,
  findUpdatedMessage,
} from '../models/messages'
import { Controller, Post, Get, Put, Delete } from 'koa-router-ts'

@Controller('/message')
export default class {
  @Get('/get/:user')
  async getMessage(ctx: Context) {
    ctx.body = await findMessageByUsername(ctx.params.user)
  }

  @Post('/add')
  async addMessage(ctx: Context) {
    ctx.body = await createMessage(ctx.query)
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
    ctx.body = `Just deleted an entry: ${entry}`
  }
}
