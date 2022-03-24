import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class messages {
  @prop({ required: true, ref: () => User })
  public nameOfUser!: Ref<User>

  @prop({ required: true })
  public text!: string

  @prop({ required: true, unique: true })
  public uniqeId?: number
}

export const messageModel = getModelForClass(messages)
