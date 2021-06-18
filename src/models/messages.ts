import { prop, getModelForClass } from '@typegoose/typegoose'

export class Messages {
    @prop({ required: true, index: true })     
    messages?: string 
}   
export const MessagesModel = getModelForClass(Messages, 
    { schemaOptions: { timestamps: true }, })