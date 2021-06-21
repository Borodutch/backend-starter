import { prop, getModelForClass } from '@typegoose/typegoose'

class Messages {
  @prop({ required: true })
  message?: string
}
export const MessageModel = getModelForClass(Messages, {
  schemaOptions: { timestamps: true },
})
