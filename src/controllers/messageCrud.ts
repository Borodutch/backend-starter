import { Message } from "@/interface/messageInterface";
import { Messages } from "@/models/messageModel";

export const getAllMessages = async () => {
    const allMessages =  Messages.find()
        .sort({createdAt: -1})
        .then()
        .catch(err => console.log(err.message));
    return allMessages;
}

export const createMessage = async (message: Message) => {
    const request: Message = message;
    const newMessage = new Messages(request);
    newMessage.save()
        .then((result: any) => console.log(result))
        .catch((err: any) => console.log(err.message))
}

export const updateMessage = async (message: Message) => {
    Messages.findOneAndUpdate({ _id: message._id }, { title: message.title, body: message.body }, { new: true })
        .then((result: any) => console.log(result))
        .catch((err: any) => console.log(err.message))
}

export const deleteMessage = async (id: string) => {
    Messages.deleteOne({ _id: id })
        .then((result: any) => console.log(result))
        .catch((err: any) => console.log(err.message))
}