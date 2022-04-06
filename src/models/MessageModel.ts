import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
  @prop({
    ref: () => User,
    required: true,
    index: true,
  })
  author!: Ref<User>
  @prop({ required: true })
  text!: string
}

const MessageModel = getModelForClass(Message)
export default MessageModel
