import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
  Prop,
} from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
class Message {
  @prop({ required: true, index: true })
  text!: string

  @prop({ required: true, index: true })
  author!: string
}

export const MessageModel = getModelForClass(Message)
