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

  await message.save()
    .then((result) => {
      return message;
    })
    .catch((err) => {
      console.log(err) 
    })
}

export async function getAllMessages() {
  console.log('inside model')
  
  await MessageModel.find()
    .then((result) => {
      console.log('inside model, before return')
      console.log(result)
      return result
    })
    .catch((err) => {
      console.log(err)
    })
}

export async function getMessage(id: string) {
  await MessageModel.findById(id)
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(err)
    })
}

export async function updateMessage(id: string, data: any){
  let message: DocumentType<Message> | undefined
  message = await MessageModel.findById(id)
    .then(() => {
      if (data.body) {
        //message.body = data.body
        console.log(`new message body is ${data.body}`)
      }
      if (data.createdBy) {
        //message.createdBy = data.createdBy
        console.log(`new message crreator is ${data.createdBy}`)
      }
    })
    
    await message.save()
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(err) 
      })
}

export async function deleteMessage(id: string) {
  await MessageModel.findByIdAndDelete(id)
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(err)
    })
}