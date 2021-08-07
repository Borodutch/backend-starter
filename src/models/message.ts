import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
    @prop({ required: true })
    msg: string
};

export const msgModel = getModelForClass(Message)