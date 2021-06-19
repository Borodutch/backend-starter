import { prop, getModelForClass } from '@typegoose/typegoose'

class Messages {
    @prop({ required: true, index: true })     
    messages?: string
}   
export const MsgsModel = getModelForClass(Messages, 
    { schemaOptions: { timestamps: true }, })