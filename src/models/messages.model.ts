import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { User } from './User'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Messages {
  @prop({ ref: () => User })
  public name: Ref<User>

  @prop({ required: true })
  public text: string

  @prop({ required: true, unique: true })
  id: string
}

const MessagesModel = getModelForClass(Messages)

export default MessagesModel
