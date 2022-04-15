import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
  State,
} from 'amala'
import { MessageMod, MessageModel } from '@/models/MessageMod'
import { MessagesIdValid, MessagesTextValid } from '@/validators/MessageVal'
import { User, findOrCreateUser } from '@/models/User'
import authMidleware from '@/midlewares/userMidWar'

@Controller('/messages')
@Flow([authMidleware])
class MessageCon {
  @Get('/:id')
  async findMessageController(@Params('id') messageId: MessagesIdValid) {
    return await MessageModel.findById(messageId)
  }
  @Post('/')
  async createMessageController(
    @Body({ required: true }) { text }: MessagesTextValid,
    @CurrentUser() user: User
  ) {
    return await MessageModel.create({ user, text })
  }
  @Patch('/')
  async updateMessageController(
    @Body() { text }: MessagesTextValid,
    @Body() { mongoId }: MessagesIdValid
  ) {
    return await MessageModel.updateOne({ id: mongoId }, { text: text })
  }
  @Delete('/:id')
  async deleteMessageController(@Params('id') { mongoId }: MessagesIdValid) {
    await MessageModel.deleteOne({ id: mongoId })
    return 'success delete'
  }
}
