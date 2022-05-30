import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })

class Message {

    @prop({ required: true })
    title!: string

    @prop({ required: true })
    body!: string
}

export const MessageModel = getModelForClass(Message)