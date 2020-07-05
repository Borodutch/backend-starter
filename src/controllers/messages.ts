import { Context } from 'koa'
import { MessageModel } from '../models/messages'
import { Controller, Post, Get, Put, Delete } from 'koa-router-ts'

@Controller('/messages')
export default class {
    @Post('/')
    async postMessage(ctx: Context) {
        await new MessageModel(ctx.request.body).save()
        ctx.status=200
    }

    @Get('/')
    async getMessages(ctx: Context) {
        ctx.body = await MessageModel.find()
    }

    @Get('/:user')
    async getMessagesFromUser(ctx: Context) {
        ctx.body = await MessageModel.find({user: ctx.params.user})
    }

    @Put('/:id')
    async putMessage(ctx: Context) {
        await MessageModel.findByIdAndUpdate({_id: ctx.params.id}, ctx.request.body)
        ctx.status=200
    }

    @Delete('/:id')
    async deleteMessage(ctx: Context) {
        await MessageModel.findByIdAndDelete({_id: ctx.params.id})
        ctx.status=200
    }
}