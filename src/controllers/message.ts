import { Body, Controller, Post } from 'amala'
import {
  createMessage,
  deleteMessageById,
  displayAllMessages,
  findById,
  updateOneMessage,
} from '@/models/Message'
import MessageValidatorDefault from '@/validators/DefaultMessage'
import MessageValidatorDelete from '@/validators/DeleteMessage'
import MessageValidatorUpdate from '@/validators/UpdateMessage'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async addMessage(
    @Body({ required: true }) { text, author }: MessageValidatorDefault
  ) {
    const message = await createMessage({ text, author })
    return message
  }

  @Post('/update-message')
  async updateMessage(
    @Body({ required: true }) { text, _id }: MessageValidatorUpdate
  ) {
    await updateOneMessage({ text, _id })
    return await findById(_id)
  }

  @Post('/delete-message')
  async deleteMessage(
    @Body({ required: true }) { _id }: MessageValidatorDelete
  ) {
    const message = await deleteMessageById(_id)
    return message
  }

  @Post('/display-messages')
  async displayMessages() {
    const messages = await displayAllMessages()
    return messages
  }
}
