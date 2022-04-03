import { Body, CurrentUser, Delete, Get, Patch, Post, Put, Query, State } from 'amala'
import { createMessage, deleteMessage, findMessage, updateMessage } from 'models/Message'

class MessageController{

  @Get('/')
  findMessageController(@Query('message') messageId: number){
    return findMessage(messageId);
  }
  @Post('/')
  createMessageController(@Body({required: true}) text: string, @CurrentUser() user: string){
    return createMessage(user, text);
  }
  @Patch('/')
  updateMessageController(@State('message') newMessage: string, @CurrentUser() user: string, @State('message') messageId: number){
    return updateMessage(user, messageId, newMessage);
  }
  @Delete('/')
  deleteMessageController(@State('message') messageId: number){
    return deleteMessage(messageId);
  }
}