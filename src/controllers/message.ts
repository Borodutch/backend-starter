import {Context} from 'koa'
import {Controller, Ctx, Delete, Get, Post, Put, Flow} from 'amala'
import {getMessages, getMessageById, addMessage, updateMessageById, deleteMessageById} from '@/models/msg'
import {auth} from '@/middleware/auth'


@Flow(auth)
@Controller('/messages')
export default class MessageController {

    @Get('/')
    async getMessages(@Ctx() ctx: Context) {
        let data = ctx.request.body
        return await getMessages(data.userID);
    }

    @Get('/:id')
    async getMessage(@Ctx() ctx: Context) {
        let id = ctx.params.id;
        let data = ctx.request.body
        return await getMessageById(data.userID, id);
    }

    @Post('/')
    async createMessage(@Ctx() ctx: Context) {
        let data = ctx.request.body;
        return addMessage(data.userID, data.text);
    }

    @Put('/')
    async updateMessage(@Ctx() ctx: Context) {
        let data = ctx.request.body;
        return updateMessageById(data.userID, data.id, data.text);
    }

    @Delete('/:id')
    async deleteMessage(@Ctx() ctx: Context) {
        let id = ctx.params.id;
        let data = ctx.request.body;
        return await deleteMessageById(data.userID, id);
    }
}

