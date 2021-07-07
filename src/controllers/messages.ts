import {
  Controller,
  Params,
  Delete,
  Get,
  Post,
  Put,
  Body,
  IsString,
  Query,
  IsArray,
  Flow,
  CurrentUser,
} from 'amala'
import {
  createMessage,
  getMessage,
  getAllMessages,
  deleteMessages,
  deleteOneMessage,
  changeMessage,
} from '@/models/message'
import { authUser } from '@/middlewares/authUser'
import { User } from '@/models/user'

// Validator classes
class MessageChangeInput {
  @IsString()
  id: string

  @IsString()
  message: string
}

class MessageAddInput {
  @IsString()
  message: string
}

class MessagesDeleteInput {
  @IsArray()
  id: string[]
}

@Flow(authUser)
@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getUserMessages(@CurrentUser() user: User) {
    return await getAllMessages(user)
  }

  @Get('/:id')
  async getUserMessage(@Params('id') id: string, @CurrentUser() user: User) {
    return await getMessage(id, user)
  }

  @Post('/')
  async addUserMessage(
    @Body({ required: true }) body: MessageAddInput,
    @CurrentUser() user: User
  ) {
    return await createMessage(body.message, user)
  }

  @Delete('/:id')
  async deleteOneUserMessage(
    @Params('id') id: string,
    @CurrentUser() user: User
  ) {
    return await deleteOneMessage(id, user)
  }

  @Delete('/')
  async deleteUserMessages(
    @Query({ required: true }) query: MessagesDeleteInput,
    @CurrentUser() user: User
  ) {
    return await deleteMessages(query.id, user)
  }

  @Put('/')
  async changeUserMessage(
    @Body({ required: true }) body: MessageChangeInput,
    @CurrentUser() user: User
  ) {
    return await changeMessage(body.id, body.message, user)
  }
}
