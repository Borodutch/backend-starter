import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Msg {
    @prop({ ref: () => User, required: true, index: true })
    userId: string

    @prop({ index: true, required: true })
    text?: string
    _doc: any
}

export const MsgModels = getModelForClass(Msg, {
    schemaOptions: { timestamps: true },
})

export async function getMessages(userID: string) {
    return MsgModels.find({ userID })
}

export async function getMessageById(userID: string, id: string) {
    return MsgModels.findById({ _id: id, userID })
}

export async function addMessage(userID: string, msgText: string) {
    let message: DocumentType<Msg> | undefined
    message = await new MsgModels({
        userID,
        text: msgText,
    }).save()
    return message
}

export async function updateMessageById(
    userID: string,
    id: string,
    msgText: string
) {
    return MsgModels.findByIdAndUpdate(
        id,
        {
            userID,
            text: msgText,
        },
        {
            new: true,
            useFindAndModify: false,
        }
    )
}

export async function deleteMessageById(userID: string, id: string) {
    return MsgModels.findOneAndDelete({ _id: id, userID })
}
