import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Params,
  Flow,
  CurrentUser,
} from 'amala'
import { messageModel } from '@/models/message'
import { auth } from '@/middleware/authMiddleware'

@Controller('/message')
@Flow(auth)
export class MessageController {
  @Post('/')
  async addMessage(
    @Body('text') text: string,
    @CurrentUser('name') author: string
  ) {
    return await messageModel.create({ text, author })
  }

  @Get('/')
  async getMessages(@CurrentUser('name') author: string) {
    return await messageModel.find({ author })
  }

  @Delete('/:id')
  async delMessage(
    @Params('id') _id: string,
    @CurrentUser('name') author: string
  ) {
    const deletedText = await messageModel.deleteOne({ _id, author })
    if (deletedText['deletedCount'] === 0) {
      return {
        _id,
        deleted: false,
        reason: 'Its not your messge or mistake in ID',
      }
    }
    return { _id, deleted: true }
  }

  @Put('/:id')
  async putMessage(
    @Params('id') _id: string,
    @Body('text') text: string,
    @CurrentUser('name') author: string
  ) {
    const updateText = await messageModel.updateOne({ _id, author }, { text })
    if (updateText['nModified'] === 0) {
      return { type: 'Error', reason: 'Cant find this message in your profile' }
    }
    return updateText
  }
}
