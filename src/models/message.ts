import { prop, getModelForClass } from '@typegoose/typegoose';

export class Message {
  @prop({ required: true })
  content: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: {
    timestamps: true, 
  }, 
})