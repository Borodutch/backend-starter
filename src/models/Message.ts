import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
})
class Message {
  @prop({ required: true })
  text!: string

  @prop({ ref: () => User, index: true, required: true })
  author!: Ref<User>
}

export const MessageModel = getModelForClass(Message)

export async function getMessageList() {
  const allMessages = await MessageModel.find()
    .sort({ createdAt: -1 })
    .populate('author')
  return allMessages
}

export async function createMessage(message: any) {
  const newMessage = new MessageModel(message)
  await newMessage.save()
}

export async function updateMessage(message: any) {
  await MessageModel.findOneAndUpdate(
    { _id: message._id },
    { text: message.text },
    { new: true }
  )
}

export async function deleteMessage(id: string) {
  await MessageModel.deleteOne({ _id: id })
}
