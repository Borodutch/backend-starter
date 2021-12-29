import { Body, Controller, Post, Get, Delete, Params, Header, Res } from 'amala'
import { MessageModel } from '@/models/message'
import { Boom } from '@hapi/boom'
import { UserModel } from '@/models/user'
// import { Context } from 'koa'
// // import { findOrCreateUser } from '@/models/user'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllMessages() {
    const messages = await MessageModel.find()
    return messages
  }

  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    try { await MessageModel.exists({ _id: id }) }
    catch {
      const err = new Boom
      err.output.payload = {
        statusCode: 401,
        error: "This message doesn't exist",
        message: "Use existing message id"
      }
      err.output.statusCode = 401
      throw err
    }
    const message = MessageModel.findById(id)
    return message
  }

  @Post('/')
  async postMessage(
    @Body({ required: true }) { text } : { text: string }, 
    @Header('author') author : string 
    ) {
      try { await UserModel.exists({ _id: author }) }
      catch {
        const err = new Boom
        err.output.payload = {
          statusCode: 401,
          error: "This user doesn't exist",
          message: "Use existing user id"
        }
        err.output.statusCode = 401
        throw err
      }
      const message = MessageModel.create({
        author,
        text
      })
      return message
  }

  @Post('/:id')
  async updateMessage(
    @Params('id') id: string, 
    @Header('author') author : string, 
    @Body({ required: true }) { new_message_text } : { new_message_text: string } 
    ) {
      try { await MessageModel.exists({ _id: id }) }
      catch {
        const err = new Boom
        err.output.payload = {
          statusCode: 401,
          error: "This message doesn't exist",
          message: "Use existing message id"
        }
        err.output.statusCode = 401
        throw err
      }

      const message = MessageModel.findById(id)
      if(message.author == author) {
        message.text = new_message_text
        message.save()
      } 
      else {
        const err = new Boom
        err.output.payload = {
          statusCode: 401,
          error: "You have no access to this message",
          message: "You can edit only your own messages"
        }
        err.output.statusCode = 401
        throw err
      }
  }
  

  @Delete('/:id')
  async deleteMsg(
    @Params('id') id: string, 
    @Header('author') author : string, 
    @Body({ required: true }) { new_message_text } : { new_message_text: string } 
    ) {
      try { await MessageModel.exists({ _id: id }) }
      catch {
        const err = new Boom
        err.output.payload = {
          statusCode: 401,
          error: "This message doesn't exist",
          message: "Use existing message id"
        }
        err.output.statusCode = 401
        throw err
      }
      const message = MessageModel.findById(id)
      if(message.author == author) {
        MessageModel.findByIdAndRemove(id)
      } 
      else {
        const err = new Boom
        err.output.payload = {
          statusCode: 401,
          error: "You have no access to this message",
          message: "You can edit only your own messages"
        }
        err.output.statusCode = 401
        throw err
      }
  }
}
