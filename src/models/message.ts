import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  authorToken: String
  @prop({ required: true })
  body: String
  @prop({ default: Date.now() })
  timeOfCreation: Date

  //Mongo property
  _doc: any
}

export const MessageModel = getModelForClass(Message,
  {
    schemaOptions: { timestamps: true },
  })