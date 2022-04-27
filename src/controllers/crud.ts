import { Controller, Ctx, Get, Post, Put, Delete } from 'amala'
import { Context } from 'koa';
import { Msg } from '@/models/msg'

@Controller('/crud')
export default class CrudController {
    @Get('/messages/')
    async allMessages () { return Msg.find({}) }

    @Post('/messages/')
    async createMessage (@Ctx() ctx: Context) { return Msg.create(ctx.request.body) }

    @Put('/messages/:id')
    async updateMessage (@Ctx() ctx: Context) {
            Msg.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body, () => {})
            return Msg.findOne({_id: ctx.params.id})
        }

    @Delete('/messages/:id')
    async deleteMessage (@Ctx() ctx: Context) { return Msg.findByIdAndRemove({_id: ctx.params.id}) }
}