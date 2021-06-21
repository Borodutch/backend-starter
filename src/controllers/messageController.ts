import { createMessage, showAllMessages, findMessageById, deleteMessageById, updateMessage } from '@/models/messageModel';
import { startKoa } from '@/__tests__/testUtils';
import {Controller, Ctx, Get, Post, Delete, Flow, Params} from 'amala';
import { Context } from 'koa'
//TODO: User authentication as a middleware using @Flow decorator
// import LoginController from '@/controllers/login';
// const userLogin: LoginController = new LoginController();


@Controller('/messages')
//@Flow(userLogin)
class messageController {
   //Show list of messages
    @Get('/')
    async messageList(@Ctx() ctx: Context) {
    return ctx.body = showAllMessages();
    }
    //Add new message
    @Post('/add')
    //@Flow(userLogin)
        async messageAdd(@Ctx() ctx: Context) {
    const data: string = ctx.request.body;
    createMessage(data);
    }
    //Show single message
    @Get('/:id')
    async showSingleMessage(@Ctx() ctx: Context, @Params('id') id: string){
    const messageId = ctx.params.id;
    return ctx.body = findMessageById(messageId);
    }
    //Delete message
    @Delete('/:id')
    async deleteSingleMessage(@Ctx() ctx: Context, @Params('id') id: string){
    const messageId = ctx.params.id;
    deleteMessageById(messageId);
    }
    //Update message
    @Post('/:id')
    async updateSingleMessage(@Ctx() ctx: Context, @Params('id') id: any){
    const messageId = ctx.params.id;
    const data = ctx.request.body; 
    updateMessage(messageId, data);
    }
}
 