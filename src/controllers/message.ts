import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import { MessageModel } from '@/models/message'
import { ValidatorForBody, ValidatorForId } from '@/validators/message'

@Controller('/')
export default class MessageController {
  @Get('/')
  getMessages() {
    return MessageModel.find({})
  }

  @Post('/')
  addMessage(@Body({ required: true }) body: ValidatorForBody) {
    return new MessageModel(body).save()
  }

  @Delete('/:id')
  deleteMessage(@Params() params: ValidatorForId) {
    return MessageModel.findByIdAndDelete(params.id)
  }

  @Put('/:id')
  updateMessage(
    @Params() params: ValidatorForId,
    @Body({ required: true }) body: ValidatorForBody
  ) {
    return MessageModel.findByIdAndUpdate(params.id, body, {
      new: true,
    })
  }
}
