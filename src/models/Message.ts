import {getModelForClass,modelOptions,prop,Ref} from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
    schemaOptions: { timestamps: true },
  })
  
export class Message {
    @prop({required:true,index:true,ref:()=>User}) 
    author!:Ref<User>
    @prop({required:true}) 
    text!:string
}

export const messageModel = getModelForClass(Message)