import {
  Ctx,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  IsString,
  Flow,
  CurrentUser,
} from 'amala'
import { Context } from 'koa'
import {
  createMessage,
  getAllMessages,
  deleteOneMessage,
} from '@/models/message'
import { authUser } from '@/middlewares/authUser'
import { User } from '@/models/user'
import { checkUser } from '@/middlewares/checkUser'

class MessageInput {
  @IsString()
  message: string
}

@Flow(authUser)
@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllUserMessages(@CurrentUser() user: User) {
    return await getAllMessages(user)
  }

  @Flow(checkUser)
  @Get('/:id')
  async getUserMessage(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Post('/')
  async createUserMessage(
    @Body({ required: true }) body: MessageInput,
    @CurrentUser() user: User
  ) {
    return await createMessage(body.message, user)
  }

  @Flow(checkUser)
  @Delete('/:id')
  async deleteOneUserMessage(@Ctx() ctx: Context) {
    return await deleteOneMessage(ctx.state.message?._id)
  }

  @Flow(checkUser)
  @Put('/:id')
  async changeUserMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: MessageInput
  ) {
    ctx.state.message.message = body.message
    return ctx.state.message.save()
  }
}
