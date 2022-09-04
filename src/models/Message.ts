import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ required: true })
  text!: string
  @prop({ required: true })
  author!: string
}

export const MessageModel = getModelForClass(Message)

export async function createMessage(messageOptions: {
  text: string
  author: string
}) {
  const message = await MessageModel.create(messageOptions)
  if (!message) throw new Error('Message do not send')
  await message.save()
  return message
}

export async function displayAllMessages() {
  const AllMessage = await MessageModel.find()
  if (!AllMessage) return 'Don not Find Messages'
  return AllMessage
}

export async function updateOneMessage(messageOptions: {
  text: string
  _id: string
}) {
  const updatedMessage = await MessageModel.findOneAndUpdate(
    { _id: messageOptions._id },
    { text: messageOptions.text }
  )
  if (!updatedMessage) throw new Error('Don not Find Message')
  return await updatedMessage.save()
}

export async function findById(_id: string) {
  const message = await MessageModel.findById({ _id })
  if (!message) throw new Error('Don not Find Message')
  return message
}

export async function deleteMessageById(_id: string) {
  const message = await MessageModel.findByIdAndDelete({ _id })
  if (!message) throw new Error('Don not Find Message')
  return message
}
