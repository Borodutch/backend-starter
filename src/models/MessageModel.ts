import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class MessageClass {
    @prop({ required: true })
    text!: String

    @prop({ required: true, index: true, ref: () => User })
    messageAuthor!: Ref<User>
}

export const MessageModel = getModelForClass(MessageClass)