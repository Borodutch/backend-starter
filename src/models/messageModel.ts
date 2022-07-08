import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'
@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({
    ref: () => User,
    required: true,
    index: true,
  })
  author!: Ref<User>
  @prop({ required: true })
  text!: string
}
export const messageModel = getModelForClass(Message)
