import { Controller, Ctx, Post, Get, Put, Delete } from 'amala'
import { Message } from '@/models/messagemodel'
import { Context } from 'koa'


@Controller('/messages')
export default class MessageController {
    @Get('/') // +
    async getAllMessages () {
        return await Message.find({})
    }

    @Post('/') // +
    async addMessage (@Ctx() ctx: Context) {
        return await Message.create(ctx.request.body)
    }

    @Put('/:id') // +
    async editMessage (@Ctx() ctx: Context) {
        await Message.findByIdAndUpdate(
            {_id: ctx.params.id}, 
            {message_body: "edited: " + ctx.request.body.message_body}
        )
        return Message.findById({_id: ctx.params.id})
    }

    @Delete('/:id') // +
    async deleteMessage (@Ctx() ctx: Context) {
        await Message.findByIdAndRemove({_id: ctx.params.id})
        return ("Message deleted")
    }
}