import { prop, getModelForClass } from '@typegoose/typegoose'

class Message {
  @prop({ required: true })
  author?: string
  @prop({ required: true })  
  text?: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
