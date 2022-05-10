import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

class Message {
    @prop({ required: true })
    public title?: string;
    
    @prop({ required: true })
    public snippet?: string;

    @prop({ required: true })
    public body?: string;

    timestamps = true;  
}

export const MessageModel = getModelForClass(Message)

