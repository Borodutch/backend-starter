import * as messageCrud from "@/controllers/messageCrud"

export const getMessageList = async (ctx: any) => {
    const messageList: any = await messageCrud.getAllMessages();
    try {
        ctx.body = messageList;
        ctx.status = 200;
    } catch (err: any) {
        ctx.body = err.message;
        ctx.status = 404;
    }
}

export const createMessage = async (ctx: any) => {
    const createdMessage = await messageCrud.createMessage(ctx.request.body);
    try {
        ctx.body = {

            isCreated: true
        }
        ctx.status = 200;
    } catch (err: any) {
        ctx.body = err.message;
        ctx.status = 404;
    }
}

export const updateMessage = async (ctx: any) => {
    const updatedMessage = await messageCrud.updateMessage(ctx.request.body);
    try {
        ctx.body = {

            isUpdated: true
        }
        ctx.status = 200;
    } catch (err: any) {
        ctx.body = err.message;
        ctx.status = 404;
    }
}

export const deleteMessage = async (ctx: any) => {
    const deletedMessage = await messageCrud.deleteMessage(ctx.request.body._id);
    try {
        ctx.body = {

            isDeleted: true
        }
        ctx.status = 200;
    } catch (err: any) {
        ctx.body = err.message;
        ctx.status = 404;
    }
}