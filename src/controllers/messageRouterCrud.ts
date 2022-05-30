import { Controller, Body, Get, Post, Put, Delete } from "amala"
import { Context } from "koa"
import { Message } from '@/models/messageInterface'
import * as crudService from './messageCrud'


@Controller('/message')
class MessageController {
    @Get('/all')
    async getMessageList(@Body() ctx: Context) {
        return await crudService.getAllMessages()
    }

    @Post('/post')
    async createMessage(@Body({ required: true }) ctx: Message) {
        await crudService.createMessage(ctx)
        return { isCreated: true }
    }

    @Put('/update')
    async updateMessage(@Body() ctx: Message) {
        await crudService.updateMessage(ctx)
        return { isUpdated: true }
    }

    @Put('/delete')
    async deleteMessage(@Body('_id') id: string) {
        await crudService.deleteMessage(id)
        return { isDeleted: true }
    }
} 