import * as msg from '@/models/message'
import { Context } from 'koa'
import { Controller, Delete, Get, Params, Patch, Post, Put, Query } from 'amala'
import { ObjectId } from 'mongoose'
import { sign } from '@/helpers/jwt'

@Controller('/')
export default class {
  @Get('/read')
  async findMessage(@Query('author') author: string) {
    console.log('inside GET READ')
    const messages = await msg.MessageModel.find({ author })
    if (!messages) {
      console.log('No messages found')
    }
    console.log(`${author}'s messages: ${messages}`)
    return messages
  }

  @Get('/readall')
  async findAllMessages() {
    // @Query('email') email?: string // @Query('author') author: string
    console.log('inside GET READ all')
    const messages = await msg.MessageModel.find()
    if (!messages) {
      console.log('No messages found')
    }
    console.log(`Messages: ${messages}`)
    return messages
  }

  @Get('/read/:id')
  async findMessageById(@Params('id') id: ObjectId) {
    console.log('inside GET READ by ID')
    const message = await msg.MessageModel.findById(id)
    if (!message) {
      console.log(`Message with ${id} not found`)
    } else {
      console.log(`Message with ${id}: ${message}`)
    }
    return message
  }

  @Post('/create')
  async createMessage(
    @Query('author') author: string,
    @Query('text') messageText: string
  ) {
    console.log('inside POST CREATE')
    const newMessage = await msg.MessageModel.create({
      author,
      messageText,
    })
    if (!newMessage) {
      console.log('Something went wrong')
    }
    if (!newMessage.token) {
      console.log('Adding token...')
      newMessage.token = await sign({ id: newMessage.id })
      console.log(newMessage.token)
      await newMessage.save()
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
    console.log('inside PATCH UPDATE')
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
    console.log('inside DELETE')
    const delMessage = await msg.MessageModel.findByIdAndDelete(id)
    if (!delMessage) {
      console.log(`Message ${id} not found`)
    }
    console.log(`Message ${id} deleted`)
    return delMessage
  }
}
