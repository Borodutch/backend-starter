import { Message } from '@/models/messageInterface'
import { MessageModel } from '@/models/MessageModel'

export const getAllMessages = async () => {
  try {
    const allMessages = await MessageModel.find().sort({ createdAt: -1 })
    return allMessages
  } catch (err: any) {
    console.log(err.message)
  }
}

export const createMessage = async (message: Message) => {
  const request: Message = message
  const newMessage = new MessageModel(request)
  try {
    await newMessage.save()
    return { isCreated: true }
  } catch (err: any) {
    console.log(err.message)
    return { isCreated: false }
  }
}

export const updateMessage = async (message: Message) => {
  try {
    await MessageModel.findOneAndUpdate(
      { _id: message._id },
      { title: message.title, body: message.body },
      { new: true }
    )
    return { isUpdated: true }
  } catch (err: any) {
    console.log(err.message)
    return { isUpdated: false }
  }
}

export const deleteMessage = async (id: string) => {
  try {
    await MessageModel.deleteOne({ _id: id })
    return { isDeleted: true }
  } catch (err: any) {
    console.log(err.message)
    return { isDeleted: false }
  }
}
