import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ ref: () => User, required: true, index: true })
  author: User

  @prop({ index: true, required: true })
  text?: string
}

export const MessageModels = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function getMessages(author: User) {
  return MessageModels.find(author)
}

export async function getMessageById(author: User, id: string) {
  return MessageModels.findById({ _id: id, author })
}

export async function addMessage(author: User, msgText: string) {
  let message: DocumentType<Message> | undefined
  message = await new MessageModels({
    author,
    text: msgText,
  }).save()
  return message
}

export async function updateMessageById(
  userID: string,
  id: string,
  msgText: string
) {
  return MessageModels.findByIdAndUpdate(
    id,
    {
      userID,
      text: msgText,
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
}

export async function deleteMessageById(author: User, id: string) {
  return MessageModels.findOneAndDelete({ _id: id, author })
}
