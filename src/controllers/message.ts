import { MessageModel } from '@/models/message' 
import { User } from '@/models/user' 
import { Context } from 'koa' 
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  CurrentUser, 
  Body, 
  Ctx, 
} from 'amala' 
 
@Controller('/message') 
export default class MessageController { 
  @Get('/') 
  async showMessages(@CurrentUser() author: User) { 
    return await MessageModel.find({ author }) 
  } 
 
  @Post('/') 
  async addMessage(@CurrentUser() author: User, @Body('text') text: string) { 
    return await MessageModel({ author, text }).save() 
  } 
 
  @Put('/:id') 
  async editMessage(@Ctx() ctx: Context, @Body('text') text: string) { 
    return await MessageModel.updateOne(ctx.state.message, { text }) 
  } 
 
  @Delete('/:id') 
  async deleteMessage(@Ctx() ctx: Context) { 
    return await MessageModel.deleteOne(ctx.state.message) 
  } 
}