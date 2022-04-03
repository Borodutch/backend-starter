import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import MessageModel from '@/models/message'
import MessageObject from '@/validators/message'

async function getMessageById(id: string) {
  const message = await MessageModel.findOne({ _id: id }).catch((error) => {
    return { error }
  })
  return message
}

@Controller('/message')
export default class MessageController {
  @Post('')
  async postMessage(@Body({ required: true }) message: MessageObject) {
    const newMessage = await MessageModel.create(message)
    return {
      result: 'Message sent',
      newMessage,
    }
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    const message = await MessageModel.findOneAndDelete({ _id: id })
    if (message) {
      return {
        result: 'Message deleted',
        message,
      }
    } else {
      return {
        Error: 'Message not found',
      }
    }
  }

  @Get('')
  async getMessages() {
    const messages = await MessageModel.find()
    if (messages) {
      return messages
    } else {
      return { Error: 'There is no massages' }
    }
  }

  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    const message = await getMessageById(id)
    if (message) {
      return message
    } else {
      return { Error: 'Message not found' }
    }
  }

  @Put('/:id')
  async updateMessage(
    @Params('id') id: string,
    @Body({ required: true }) { text }: MessageObject
  ) {
    const newMessage = await MessageModel.findOneAndUpdate(
      { _id: id },
      { text },
      { new: true }
    )
    if (newMessage) {
      return {
        result: 'Message updated',
        newMessage,
      }
    } else {
      return { Error: 'Message not found' }
    }
  }
}
