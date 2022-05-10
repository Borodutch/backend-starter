import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Messages {
  @prop({ ref: () => User, required: true, index: true })
  author!: Ref<User>

  @prop({ required: true })
  text!: string
}

const MessagesModel = getModelForClass(Messages)

export default MessagesModel
