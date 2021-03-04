import { Controller, Get, Post, Delete, Put } from 'koa-router-ts' 
import { Context } from 'koa'
import messgModel from '../models/schema';
import {UserModel, getOrCreateUser} from '@/models/user'

@Controller('/message') 

export default class MessageController { 
    @Post('/save')   

async addMessage  (ctx: Context) { 

  try {getOrCreateUser(ctx.request.body)} catch(err){console.log(err)}

 let  msg  = new messgModel(ctx.request.body);
      await msg.save()
      msg.populate('messages') 
      await msg.execPopulate() 
     ctx.body ={ msg } 
 }
 @Get('/read/:id')
 async getMessages (ctx: Context) {
  let  msg = await messgModel.findById({
    _id: ctx.params.id,
  }, (error, data) =>{
    if(error){console.log(error)} else{
      console.log('data:', data)
    }
  })  
  let usr = await UserModel.findById({
    _id: ctx.params.id,
  }, 
  (error, data) =>{
    if(error){console.log(error)} else{
      console.log('user:', data)}
    }
    )
   
    ctx.body ={ msg }, {usr} 
}
@Delete('/del/:id')
  async deleteMessage (ctx: Context) {
  await messgModel.findByIdAndDelete({
      _id: ctx.params.id
    }  ) 
    await UserModel.findByIdAndDelete({
        _id: ctx.params.id
      }  )
  ctx.body = 'Deleted'
  }
  
 @Put('/upd/:id')
  async updateMessage (ctx: Context) {
   ctx.body = await messgModel.findByIdAndUpdate({
      _id: ctx.params.id,
    },{  $set:{
      title: ctx.request.body.title,
      body: ctx.request.body.body },
   timestamps: true}, 
   (error) =>{
    if(error){console.log(error)} 
 } ).then((data)=>{return data})
  
  }
   
  
}

  
    
