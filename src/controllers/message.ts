import { Controller, Delete, Get, Patch, Post, Body } from "amala";
import { crudMessage } from "@/models/message";

@Controller('/message')
export default class MessageController {
    @Post('/')
    async addMessage(@Body('text') text: string, @Body('time') time:string){
        await crudMessage.createMessage(text, time)
    }

    @Patch('/')
    async updateMessage(@Body('id') id: string, @Body('text') newText: string){
        await crudMessage.updateMessage(id, newText)
    }

    @Get('/')
    async getMessages() {
       const messages = await crudMessage.getMessages()
       return messages
    }

    @Delete('/')
    async deleteMessage(@Body('id') id: string) {
        await crudMessage.deleteMessage(id)
    }
}