import * as boom from '@hapi/boom'
import * as msg from '@/models/message'
import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Params, Patch, Post, Query } from 'amala'
import { ObjectId } from 'mongoose'

@Controller('/messages')
export default class {
  @Get('/')
  async findAllMessages(@Ctx() ctx: Context) {
    const messages = await msg.MessageModel.find()
    if (!messages) {
      ctx.throw(boom.notFound('No messages found'))
    }
    console.log(`Messages: ${messages}`)
    return messages
  }

  @Get('/:id')
  async findMessageById(@Params('id') id: ObjectId, @Ctx() ctx: Context) {
    const message = await msg.MessageModel.findById(id)
    if (!message) {
      ctx.throw(boom.notFound(`Message with ${id} not found`))
    } else {
      console.log(`Message with ${id}: ${message}`)
    }
    return message
  }

  @Post('/create')
  async createMessage(
    @Query('author') author: string,
    @Query('text') text: string,
    @Ctx() ctx: Context
  ) {
    const newMessage = await msg.MessageModel.create({
      author,
      text,
    })
    if (!newMessage) {
      ctx.throw(boom.internal('Something went wrong'))
    }
    console.log(`Message created: ${newMessage}`)
    return newMessage
  }

  @Patch('/update/:id')
  async updateMsgById(
    @Params('id') id: ObjectId,
    @Query('author') author?: string,
    @Query('text') messageText?: string
  ) {
    const updMessage = await msg.MessageModel.findByIdAndUpdate(
      id,
      { author: author, messageText: messageText },
      { new: true }
    )
    console.log(`Updated message ${id}: ${updMessage}`)
    return updMessage
  }

  @Delete('/delete/:id')
  async deleteMsgById(@Params('id') id: ObjectId) {
    const delMessage = await msg.MessageModel.findByIdAndDelete(id)
    if (!delMessage) {
      console.log(`Message ${id} not found`)
    }
    console.log(`Message ${id} deleted`)
    return delMessage
  }
}
