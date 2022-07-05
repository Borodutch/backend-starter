import { User } from '@/models/User'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ required: true, index: true })
  title?: string
  @prop({ required: true, index: true })
  body?: string
  @prop({ required: true, index: true })
  id?: string
  @prop({ required: true, index: true })
  authoruser!: User
}

export const messageModel = getModelForClass(Message)

export async function CreateMessage(messageOptions: {
  title: string
  body: string
  id: string
}) {
  const message = await messageModel.findOneAndUpdate(
    messageOptions,
    {},
    {
      upsert: true,
      new: true,
    }
  )
  await message?.save()
  return message
}
