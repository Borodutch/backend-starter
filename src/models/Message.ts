import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop()
  text?: string
  @prop({ index: true, ref: () => User })
  author?: Ref<User>
}

export const MessageModel = getModelForClass(Message)
