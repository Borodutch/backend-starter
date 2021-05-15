import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
    @prop({ required: true })
    note?: string
      
    // Mongo property
    _doc: any
  }
  
  export const MessageModel = getModelForClass(Message, {
    schemaOptions: { timestamps: true },
  })
  
  interface MessageOptions {
    note?: string
    
  }
