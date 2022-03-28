import { Body, Controller, Delete, Flow, Get, Params, Post } from 'amala'
import { IdValid, TextValid } from '@/validators/MessageValidator'
import {
  findMessage,
  removeMessage,
  updateMessage,
  сreateMessage,
} from '@/models/Message'
import verifToken from '@/helpers/tokenMiddleware'

@Controller('/messages')
@Flow(verifToken)
export default class MessageController {
  @Post('/')
  async createMsg(@Body({ required: true }) body: TextValid) {
    return сreateMessage(body)
  }

  @Get('/:id')
  async getMsg(@Params() { id }: IdValid) {
    return findMessage(id)
  }

  @Post('/:id')
  async updateMsg(
    @Body({ required: true }) body: TextValid,
    @Params() { id }: IdValid
  ) {
    return updateMessage(id, body)
  }

  @Delete('/:id')
  async removeMsg(@Params() { id }: IdValid) {
    return removeMessage(id)
  }
}
