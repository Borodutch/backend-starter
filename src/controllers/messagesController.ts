import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
// import { msgNeedId, msgNoId } from '@/validators/Messages'
import msgModel from '@/models/Message'

interface msgObj {
  id?: string
  title?: string
  description?: string
  error?: string
  result?: string
}

async function getMessageById(id: string) {
  const message = await msgModel.findOne({ _id: id }).catch((error) => {
    return { error }
  })
  return message
}

@Controller('/message')
export default class MessageController {
  @Post('')
  async postMessage(@Body({ required: true }) msg: msgObj) {
    if (msg.title) {
      const newMsg = await msgModel.create(msg)
      return {
        result: 'Message sent',
        message: newMsg,
      }
    } else {
      return { Error: 'Title is required' }
    }
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    const msg = await msgModel
      .findOneAndDelete({ _id: id })
      .then((message) => {
        return {
          result: 'Message deleted',
          message,
        }
      })
      .catch((error) => {
        return { error }
      })
    return msg
  }

  @Get('')
  async getMessages() {
    const messages = await msgModel.find()
    return messages
  }

  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    return await getMessageById(id)
  }

  @Put('/:id')
  async updateMessage(
    @Params('id') id: string,
    @Body({ required: true }) msg: msgObj
  ) {
    const newMsg = await msgModel
      .findOneAndUpdate({ _id: id }, msg)
      .then(async function () {
        const message = await getMessageById(id)
        return {
          result: 'Message updated',
          message,
        }
      })
      .catch((error) => {
        return { error }
      })
    return newMsg
  }
}
