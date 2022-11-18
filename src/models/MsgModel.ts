import { ObjectId } from 'mongoose'
import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export default class Message {
  _id!: ObjectId
  @prop({ required: true })
  user!: Ref<User>
  @prop({ required: true })
  text?: string
}
export const MsgModel = getModelForClass(Message)
