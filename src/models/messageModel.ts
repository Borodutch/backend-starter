import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
@modelOptions({
  schemaOptions: { timestamps: true },
})
export default class Message {
  @prop({ required: true, index: true })
  user!: string
  @prop({ required: true, index: true })
  message?: string
}
export const messageModel = getModelForClass(Message)
