import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export const createMessage = async (text: string): Promise<void> => {
  await new MessageModel({ text }).save()
}

export const updateMessage = async (
  id: string,
  newText: string
): Promise<void> => {
  await MessageModel.findOneAndUpdate(
    { _id: id },
    { text: newText },
    {
      new: true,
    }
  )
}

export const getMessages = async (): Promise<void> => {
  await MessageModel.find({})
}

export const deleteMessage = async (id: string): Promise<void> => {
  await MessageModel.deleteOne({ id: id }).exec()
}
