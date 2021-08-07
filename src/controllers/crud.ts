import { Context } from 'koa'
import { Controller, Get, Post, Put, Delete, Flow, Body, Params } from 'amala';
import { msgModel } from '@/models/index';

@Controller('/crud')
    export class ControllerCRUD {

        @Post('/add')    
        async addAnsw( @Body('msg') message: string | number ) {
          const newMessage = await msgModel.create({ msg: message });
          return `Сообщение сохранено. ID:${newMessage._id}. Текст: ${newMessage}`
        };
        
        @Get('/')    
        async getAnsw() {
          const messages = await msgModel.find()
          return messages
        };

        @Delete('/:id')    
        async delAnsw( @Params('id') id: any ) {
          await msgModel.deleteOne({_id: id})
          return `Сообщение с ID: ${id} удалено`
        };

        @Put('/:id')    
        async putAnsw( @Params('id') id: any, @Body('newMsg') newMsg: string ) {
          const message = await msgModel.findOne({_id: id});
          message.msg = newMsg;
          await message.save();
          return `Собщение измененено: ${message}`
        };

    };
