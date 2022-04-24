import { Controller, Body, Ctx, Params, Post, Get, Put, Delete } from 'amala'
import { Message } from '@/models/messagemodel'
import { Context } from 'koa'
import CorrectMessage from '@/validators/CorrectMessage'

@Controller('/messages')
export default class MessageController {
    @Get('/')
    getAllMessages () {
        return Message.find({})
    }

    @Post('/')
    addMessage (
        @Ctx() ctx: Context, 
        @Body({ required: true }) body: CorrectMessage
        ) {
        return Message.create(ctx.request.body)
    }

    @Put('/:id')
    editMessage (
        @Ctx() ctx: Context,
        @Body({ required: true }) body: CorrectMessage,
        @Params('id') id: number
    ) {
        Message.findByIdAndUpdate(
            {_id: ctx.params.id}, 
            {message_body: "edited: " + ctx.request.body.messageBody}
        )
        return Message.findById({_id: ctx.params.id})
    }

    @Delete('/:id')
    deleteMessage (
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        Message.findByIdAndRemove({_id: ctx.params.id})
        return ("Message deleted")
    }
}