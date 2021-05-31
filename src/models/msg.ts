import {DocumentType, getModelForClass, prop} from '@typegoose/typegoose';

export class Msg {
    @prop({index: true, required: true})
    text?: string
    _doc: any
}

export const MsgModels = getModelForClass(Msg, {
    schemaOptions: {timestamps: true},
})

export async function getMessages() {
    return MsgModels.find()
}

export async function getMessageById(id: string) {
    return MsgModels.findById(id)
}

export async function addMessage(msgText: string) {
    let message: DocumentType<Msg> | undefined
    message = await new MsgModels({
        text: msgText,
    }).save()
    return message
}

export async function updateMessageById(id: string, msgText: string) {
    return MsgModels.findByIdAndUpdate(
        id,
        {
            text: msgText
        },
        {
            new: true, useFindAndModify: false
        }
    );
}

export async function deleteMessageById(id: string) {
    return MsgModels.findByIdAndDelete(id)
}
