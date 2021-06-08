import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {

  @prop({required: true, index: true})
  message: string
  
  @prop({ required: true, index: true, unique: true  })
  name: string

  
  // Mongo property
  //_doc: any
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true, collection: 'messages'}
})
