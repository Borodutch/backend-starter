import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";

export class Message {
    @prop({required: true})
    text: string
    @prop({required: true})
    time: string
}

export const MessageModel = getModelForClass(Message)

class CrudMessage {

    async createMessage(text: string,time:string) {
        await new MessageModel({text, time}).save()
    }

    async updateMessage(id, newText) {
        await MessageModel.findOneAndUpdate({_id: id}, {text: newText}, {
            new: true
          })
    }

    async getMessages() {
      const messages = await MessageModel.find({})
      return messages
    }

    async deleteMessage(id: string) {
      const response = await MessageModel.deleteOne({id: id}).exec()
      console.log(response)
    }
}

export const crudMessage = new CrudMessage()
