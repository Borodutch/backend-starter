import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
  @prop({ required: true })
  author!: string
  @prop({ required: true })
  text!: string
}
const messageModel = getModelForClass(Message)
export default messageModel
