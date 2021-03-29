import { MessageModel } from '@/models/message'
import { getOrCreateUser } from '@/models/user'
import { Context } from 'koa'
import { Controller, Ctx, Get, Post, Put, Delete } from 'koa-ts-controllers'

@Controller('/messages')
export default class MessageController {
    @Get('/')
    async getAllMessages(@Ctx() ctx: Context) {
        await MessageModel.find().sort({createdAt: -1})
        .then(result =>ctx.res.end(JSON.stringify(result)))
        .catch(err =>console.log(err))
    }

    @Get('/:id')
    async getOneMessage(@Ctx() ctx: Context) {
        await MessageModel.findById(ctx.params.id)
        .then(result =>ctx.res.end(JSON.stringify(result)))
        .catch(err => console.log(err))
    }

    @Post('/add')
    async postMessage(@Ctx() ctx: Context) {
        const user = await getOrCreateUser({telegramId: ctx.request.body.telegramId, facebookId: ctx.request.body.facebookId, email: ctx.request.body.email, name: ctx.request.body.name})
        await MessageModel.create({author: user, title: ctx.request.body.title, body: ctx.request.body.body})
        .catch(err => console.log(err))
    }

    @Put('/:id')
    async putMessage(@Ctx() ctx: Context) {
        await MessageModel.findByIdAndUpdate(ctx.params.id, {title: ctx.request.body.title, body: ctx.request.body.body})
        .catch(err => console.log(err))
    }

    @Delete('/:id')
    async deleteMessage(@Ctx() ctx: Context) {
        await MessageModel.findByIdAndDelete(ctx.params.id)
        .catch(err => console.log(err))
    }
}
