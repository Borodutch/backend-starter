import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
    @prop({ ref: () => User, index: true , required: true})
    author: User
  
    @prop({ index: true, required: true })
    text: string
  }

export const MessageModels = getModelForClass(Message, {
    schemaOptions: { timestamps: true },
  })
  
  
export async function createMessage(author: User, MessageText: string) {
    return new MessageModels({
      author,
      text: MessageText,
    }).save()
  }
  
export async function readMessages(author: User) {
    return MessageModels.find(author)
  }

export async function readMessageById(author: User, id: string) {
    return MessageModels.findById({ _id: id, author })
  }

export async function updateMessageById(
    author: User,
    id: string,
    MessageText: string
  ) {
    return MessageModels.findByIdAndUpdate({_id: id, author, {MessageText}})
     
  
export async function deleteMessageById(author: User, id: string) {
    return MessageModels.findByIdAndDelete({ _id: id, author })
  }