import { Controller, Body, Get, Post, Put, Params, Delete, Header } from 'amala'
import { MessageModel } from '@/models/Message'
import { CreateMessage, UpdateMessage, IdMessage } from '@/validators/Message'
import { verify } from '@/helpers/jwt'
import { Token } from '@/validators/Login'

@Controller('/message')
class MessageController {
  @Get('/')
  async getMessages(@Header() { token }: Token) {
    return MessageModel.find({ author: verify(token).id })
  }

  @Post('/')
  async createMessages(
    @Header() { token }: Token,
    @Body({ required: true }) { text }: CreateMessage,
    author = verify(token).id
  ) {
    await new MessageModel({ text, author }).save()
  }

  @Put('/:id')
  async updateMessages(
    @Body({ required: true }) { text }: UpdateMessage,
    @Params() { id }: IdMessage
  ) {
    const updatedMessage = await MessageModel.findOneAndUpdate(
      { _id: id },
      { text: text },
      { returnDocument: 'after' }
    )
    return updatedMessage
  }

  @Delete('/:id')
  async deleteMessages(@Params() { id }: IdMessage) {
    const deletedMessage = await MessageModel.findByIdAndDelete({ _id: id })
    return deletedMessage
  }
}
