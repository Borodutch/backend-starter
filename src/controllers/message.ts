import { Body, Controller, CurrentUser, Delete, Flow, Get, Post, Put, State } from 'amala'
import { Context } from 'koa'
import { User } from '@/models/User'
import { MessageModel } from '@/models/MessageModel'
import checkMessage from '@/middlewares/checkMessage'
import checkUser from '@/middlewares/checkUser'


@Controller('/crud')
@Flow(checkUser)
export class MessageController {
    @Get('/')
    async getMessage(@CurrentUser() messageAuthor: User) {
        return await MessageModel.find({ messageAuthor })
    }

    @Post('/')
    async postMessage(@CurrentUser() messageAuthor: User, @Body({ required: true }) text: String) {
        return new MessageModel({ text, messageAuthor }).save()        
    }

    @Put('/:id')
    @Flow(checkMessage)
    async putMessage(@Body({ required: true }) text: String,  @State('message') message: Context) {
        return MessageModel.findByIdAndUpdate({ _id: message.id }, { text })
    }

    @Delete('/:id')
    @Flow(checkMessage)
    async deleteMessage(@State('message') message: Context) {
        return MessageModel.findByIdAndDelete({ _id: message.id })
    }
}