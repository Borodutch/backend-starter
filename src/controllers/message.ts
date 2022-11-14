import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import { authenticationUser } from '@/models/User'
import {
  createMessage,
  deleteMessage,
  getMessage,
  updateMessage,
} from '@/models/Message'
import MessageCreate from '@/validators/MessageCreate'
import MessageGetOrDelet from '@/validators/MessageGetOrDelet'
import MessageUpdate from '@/validators/MessageUpdate'

@Controller('/message')
export default class MessageController {
  @Post('/create')
  async create(@Body({ required: true }) { token, text }: MessageСreate) {
    const id_user = await authenticationUser({ token })
    const message = await createMessage({
      id_user,
      text,
    })
    return message.strippedAndFilled({ withExtra: true })
  }

  @Post('/get')
  async get(@Body({ required: true }) { token, id }: MessageGetOrDelet) {
    const id_user = await authenticationUser({ token })
    const message = await getMessage({
      id,
      id_user,
    })
    return message.strippedAndFilled({ withExtra: true })
  }

  @Post('/update')
  async update(@Body({ required: true }) { token, id, text }: MessageUpdate) {
    const id_user = await authenticationUser({ token })
    const message = await updateMessage({
      id,
      id_user,
      text,
    })
    return message.strippedAndFilled({ withExtra: true })
  }

  @Post('/delete')
  async delete(@Body({ required: true }) { token, id }: MessageGetOrDelet) {
    const id_user = await authenticationUser({ token })
    await deleteMessage({ id, id_user })
    return '{"messege" : "successfully"}'
  }
}
