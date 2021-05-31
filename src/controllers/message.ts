import {Context} from 'koa'
import {Controller, Ctx, Delete, Get, Post, Put} from 'amala'
import {getMessages, getMessageById, addMessage, updateMessageById, deleteMessageById} from '@/models/msg';

@Controller('/messages')
export default class MessageController {

    @Get('/')
    async getMessages(@Ctx() ctx: Context) {
        return await getMessages();
    }

    @Get('/:id')
    async getMessage(@Ctx() ctx: Context) {
        let id = ctx.params.id;
        return await getMessageById(id);
    }

    @Post('/')
    async createMessage(@Ctx() ctx: Context) {
        let data = ctx.request.body;
        return addMessage(data.text);
    }

    @Put('/')
    async updateMessage(@Ctx() ctx: Context) {
        let data = ctx.request.body;
        return updateMessageById(data.id, data.text);
    }

    @Delete('/:id')
    async deleteMessage(@Ctx() ctx: Context) {
        let id = ctx.params.id;
        return await deleteMessageById(id);
    }
}

