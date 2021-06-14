import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {
  @prop()
  body: string

  @prop()
  createdBy: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

interface MessageOptions  {
  body: string | string[]
  createdBy: string | string[]
}

export async function createMessage(messageOptions: MessageOptions) {
  let message: DocumentType<Message> | undefined
  message = new MessageModel({
    body: messageOptions.body,
    createdBy: messageOptions.createdBy
  })
  try {
    await message.save()
    return message;
  } catch(err) {
    console.log(err) 
  }
}

export async function getAllMessages() {
  try {
    return await MessageModel.find()
  } catch(err) {
    console.log(err)
  }
}

export async function getMessage(id: string) {
  try {
    return await MessageModel.findById(id)
  } catch(err) {
    console.log(err)
  }
}

export async function updateMessage(id: string, data: any){
  let message: DocumentType<Message> | undefined
  try {
    message = await MessageModel.findById(id)
    if (data.body) {
      message.body = data.body
      console.log(`new message body is ${data.body}`)
    }
    if (data.createdBy) {
      message.createdBy = data.createdBy
      console.log(`new message crreator is ${data.createdBy}`)
    }

    try {
      return await message.save()
    } catch(err) {
      console.log(err)
    }
    
  } catch(err) {
    console.log(err)
  }
}

export async function deleteMessage(id: string) {
  try {
    return await MessageModel.findByIdAndDelete(id)
  } catch(err) {
    console.log(err)
  }
}