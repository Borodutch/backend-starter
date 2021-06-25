import { MessageModel } from '@/models/message'
import { Controller, Flow, Get, Post, Put, Delete, Params, Body } from 'amala'
import * as jwt from 'jsonwebtoken'

const secret = process.env.JWT

const auth = async (ctx) => {
  const user = await MessageModel.findOne({ author: ctx.request.body })
  const token = jwt.sign(user, secret)
  ctx.headers['Authorization'] = 'Bearer ' + token
}

const verify = async (ctx, next) => {
  const token = ctx.headers['Authorization'].split(' ')[1]
  if (!token) {
    return 'Error'
  }
  const user = jwt.verify(token, secret)
  ctx.state.user = await MessageModel.findOne({ user })

  await next()
}

@Controller('/')
@Flow(verify)
export default class {
  @Post('/auth')
  @Flow(auth)
  
  @Post('/')
  async create(@Body() body) {
    const newMsg = new MessageModel({ text: body })
    await newMsg.save()
  }

  @Get('/:id')
  async read(@Params('id') id) {
    const someMsg = await MessageModel.findById(id)
    return someMsg
  }

  @Put('/:id')
  async update(@Body() body, @Params('id') id) {
    await MessageModel.findByIdAndUpdate(id, { text: body })
  }

  @Delete('/:id')
  async delete(@Params('id') id) {
    await MessageModel.findByIdAndDelete(id)
  }
}
