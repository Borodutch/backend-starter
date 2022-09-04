import { Body, Controller, Post } from 'amala'
import {
  MessageValidatorDefault,
  MessageValidatorDelete,
  MessageValidatorUpdate,
} from '@/validators/MessageValidator'
import {
  createMessage,
  deleteMessageById,
  displayAllMessages,
  findById,
  updateOneMessage,
} from '@/models/Message'

@Controller('/message')
export default class MessageController {
  @Post('/add-message')
  async addMessage(@Body({ required: true }) body: MessageValidatorDefault) {
    const message = await createMessage(body)
    return message
  }

  @Post('/update-message')
  async updateMessage(
    @Body({ required: true }) { content, type, _id }: MessageValidatorUpdate
  ) {
    await updateOneMessage({ content, type, _id })
    return await findById({ _id })
  }

  @Post('/delete-message')
  async deleteMessage(@Body({ required: true }) _id: MessageValidatorDelete) {
    const message = await deleteMessageById(_id)
    return message
  }

  @Post('/display-messages')
  async displayMessages() {
    const messages = await displayAllMessages()
    return messages
  }
}
