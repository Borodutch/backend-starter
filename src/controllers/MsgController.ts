import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'
import { MsgModel } from '@/models/MsgModel'
import { User } from '@/models/User'
import MsgState from '@/validators/MsgState'
import MsgValidator from '@/validators/MsgValidator'
import authentificate from '@/middlewares/authUser'
import getMsgById from '@/middlewares/getMsgById'

@Controller('/msg')
@Flow(authentificate)
export default class CRUD {
  @Post('/')
  createMsg(
    @CurrentUser() user: User,
    @Body({ required: true }) { text }: MsgValidator
  ) {
    // console.log(user, text)

    return MsgModel.create({ text, user })
  }

  @Get('/')
  getMsg(@CurrentUser() user: User) {
    console.log(MsgModel.find({ user }))

    return MsgModel.find({ user })
  }

  @Get('/:id')
  @Flow(getMsgById)
  getOneMsg(@State() { message }: MsgState) {
    // console.log(message._id.toString())

    return message
  }

  @Put('/:id')
  @Flow(getMsgById)
  updateMsg(
    @State() { message }: MsgState,
    @Body({ required: true }) { text }: MsgValidator
  ) {
    return MsgModel.findByIdAndUpdate(message._id.toString(), { text })
  }

  @Delete('/:id')
  @Flow(getMsgById)
  deleteMsg(@State() { message }: MsgState) {
    return MsgModel.findByIdAndDelete(message._id.toString())
  }
}
