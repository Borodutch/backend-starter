import { MessageModel } from '@/models/Message'

export const getAllMessages = async () => {
  try {
    const allMessages = await MessageModel.find().sort({ createdAt: -1 })
    return allMessages
  } catch (err: any) {
    console.log(err.message)
  }
}

export const createMessage = async (message: any) => {
  const request: any = message
  const newMessage = new MessageModel(request)
  try {
    await newMessage.save()
    return { isCreated: true }
  } catch (err: any) {
    console.log(err.message)
    return { isCreated: false }
  }
}

export const updateMessage = async (message: any) => {
  try {
    console.log(message)
    await MessageModel.findOneAndUpdate(
      { _id: message._id },
      { text: message.text, author: message.author },
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
