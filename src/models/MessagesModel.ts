import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  //
  @prop({ required: true })
  //Check text is string
  text!: string
}

export const MessagesModel = getModelForClass(Message)
