import { getModelForClass, prop } from '@typegoose/typegoose'

class Message {
  @prop({ required: true })
  text: string
}

const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export const createMessage = async (text: string) => {
  return await new MessageModel({ text }).save()
}

export const updateMessage = async (id: string, newText: string) => {
  return await MessageModel.findOneAndUpdate(
    { _id: id },
    { text: newText },
    {
      new: true,
    }
  )
}

export const getMessages = async () => {
  return await MessageModel.find({})
}

export const deleteMessage = async (id: string) => {
  return await MessageModel.deleteOne({ id: id }).exec()
}
