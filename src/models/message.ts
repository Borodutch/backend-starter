import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";

export class Message {
    @prop({required: true})
    text: string
    @prop({required: true})
    time: string
}

export const MessageModel = getModelForClass(Message)

class CrudMessage {

    async createMessage( text: string, time: string): Promise<void> {
        await new MessageModel({text, time}).save()
    }

    async updateMessage(id: string, newText: string): Promise<void> {
       await MessageModel.findOneAndUpdate({_id: id}, {text: newText}, {
            new: true
          })
    }

    async getMessages(): Promise<any> {
      const messages = await MessageModel.find({})
      return messages
    }

    async deleteMessage(id: string): Promise<void> {
      const response = await MessageModel.deleteOne({id: id}).exec()
      return response
    }
}

export const crudMessage = new CrudMessage()
