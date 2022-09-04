import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ index: true })
  content!: string
  @prop({ index: true, lowercase: true })
  type!: string
}

export const MessageModel = getModelForClass(Message)

export async function createMessage(messageOptions: {
  content: string
  type: string
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
  content: string
  type: string
  _id: string
}) {
  const updatedMessage = await MessageModel.findOneAndUpdate(
    { _id: messageOptions._id },
    { content: messageOptions.content, type: messageOptions.type }
  )
  if (!updatedMessage) throw new Error('Don not Find Message')
  return await updatedMessage.save()
}

export async function findById(messageOptions: { _id: string }) {
  const message = await MessageModel.findById(messageOptions)
  if (!message) throw new Error('Don not Find Message')
  return message
}

export async function deleteMessageById(messageOptions: { _id: string }) {
  const message = await MessageModel.findByIdAndDelete(messageOptions._id)
  if (!message) throw new Error('Don not Find Message')
  return message
}
