import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import { MessagesModel } from '@/models/MessagesModel'
import DocumentId from '@/validators/DocumentId'
import MessageContentPayload from '@/validators/MessageContentPayload'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  //Requires a parameter in the createMessage method in the body to make the presence of the message mandatory, and the payload parameter checks if the content of the message is text
  createMessage(@Body({ required: true }) payload: MessageContentPayload) {
    return MessagesModel.create({ text: payload.text })
  }

  @Put('/:id')
  async updateMessage(
    @Params('id') id: DocumentId,
    @Body({ required: true }) payload: MessageContentPayload
  ) {
    //The first argument finds the message by id, the second argument replaces "text" with the new text
    const updatedMessage = await MessagesModel.findByIdAndUpdate(id, {
      text: payload.text,
    })
    //Returns a message in postman
    return await MessagesModel.findById(updatedMessage)
  }

  @Delete('/:id')
  //The id from the url is passed in the method and a check is made whether the id is a hexadecimal code and a string and returns the found element
  deleteMessage(@Params('id') id: DocumentId) {
    return MessagesModel.findByIdAndDelete(id)
  }

  @Get('/')
  getMessages() {
    //this return all messages
    return MessagesModel.find({})
  }
}
