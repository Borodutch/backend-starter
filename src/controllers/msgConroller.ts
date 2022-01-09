import {Controller, Body, Post, Get, Delete, Patch, IsString} from 'amala'

import {getMsgs, createMsg, deleteMsg, updateMsg} from '@/models/msg'

@Controller('/message')
export default class MsgController {
  @IsString()
  @Get('/')
  async getMessages() {
    await getMsgs()
  }

  @IsString()
  @Post('/')
  async createMessage(@Body('txt') txt: string) {
    await createMsg(txt)
  }

  @IsString()
  @Delete('/')
  async deleteMessage(@Body('id') id: string) {
    await deleteMsg(id)
  }

  @IsString()
  @Patch('/')
  async updateMessage(@Body('id') id: string, @Body('updatedTxt') updatedTxt: string) {
    await updateMsg(id, updatedTxt)
  }
}
