import { getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./user";

export class Message {
    //TODO: Add user authentication
    // @prop({ required: true, index: true })
    // user: User  
    @prop({ required: true, index: true })
    body: string
}

export const MessageModel = getModelForClass(Message, {
    schemaOptions: { timestamps: true },
  })

export async function createMessage(body) {
const message = new MessageModel({body: body}).save()
}

export async function showAllMessages() {
    let messageList = MessageModel.find();
    return messageList;
}

export async function findMessageById(id: string) {
    let message = MessageModel.findById(id);
    return message;
}

export async function deleteMessageById(id: string) {
    await MessageModel.deleteOne({_id: id});
}

export async function updateMessage(id: string, body: string) {
    await MessageModel.updateOne({_id: id}, {body: body})
}