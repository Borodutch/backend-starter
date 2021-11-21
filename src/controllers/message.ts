import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import { MessageModel } from '@/models/message'
import {
  ValidatorForBody,
  ValidatorForId,
  ValidatorForUser,
} from '@/validators/message'
import auth from '@/middleware/auth'

@Controller('/')
@Flow(auth)
export default class {
  @Get('/')
  getMessages(@CurrentUser() { name }: ValidatorForUser) {
    return MessageModel.find({ author: name })
  }

  @Post('/')
  addMessage(
    @Body({ required: true }) { text }: ValidatorForBody,
    @CurrentUser() { name }: ValidatorForUser
  ) {
    return new MessageModel({ author: name, text }).save()
  }

  @Delete('/:id')
  async deleteMessage(
    @CurrentUser() { name }: ValidatorForUser,
    @Params() params: ValidatorForId
  ) {
    await MessageModel.findOneAndDelete({ author: name, _id: params.id })
  }

  @Put('/:id')
  updateMessage(
    @CurrentUser() { name }: ValidatorForUser,
    @Params() params: ValidatorForId,
    @Body({ required: true }) body: ValidatorForBody
  ) {
    return MessageModel.findOneAndUpdate(
      { author: name, _id: params.id },
      body,
      {
        new: true,
      }
    )
  }
}
