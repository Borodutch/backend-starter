import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function createMessage(text: string) {
  try {
    let message = await new MessageModel({ text }).save()
    return message
  } catch (error) {
    console.log(error)
  }
}

export async function showAllMessages() {
  try {
    let messageList = await MessageModel.find()
    return messageList
  } catch (error) {
    console.log(error)
  }
}

export async function findMessageById(id: string) {
  try {
    let message = await MessageModel.findById(id)
    return message
  } catch (error) {
    console.log(error)
  }
}

export async function deleteMessageById(id: string) {
  try {
    await MessageModel.findByIdAndDelete({ _id: id })
  } catch (error) {
    console.log(error)
  }
}

export async function updateMessage(id: string, text: string) {
  try {
    await MessageModel.findByIdAndUpdate({ _id: id }, { text })
  } catch (error) {
    console.log(error)
  }
}
