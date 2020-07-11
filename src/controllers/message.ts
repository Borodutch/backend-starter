import { Context } from 'koa'
import { getAllMessages, deleteMessage, updateMessage, createMessage } from '../models/message'
import { getOrCreateUser } from '../models/user'
import { Controller, Post, Get, Delete, Put } from 'koa-router-ts'


@Controller('/messages')
export default class {

  @Post('/createUser')
  async createUser(ctx: Context) {
    const newUser = ctx.request.body;
    
    const user = await getOrCreateUser({
      name: newUser.name,
      email: newUser.mail
    })

    console.log(user)
    ctx.body = user

  }

  @Post('/addMsg')
  async createMessage(ctx: Context) {
    const msg = ctx.request.body;

    const message = await createMessage({
      title: msg.title,
      text: msg.text,
      user: '5f08832066efae2d805acdd2'
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
