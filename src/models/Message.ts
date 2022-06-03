import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
class Author {
  @prop({ required: true })
  firstName!: string

  @prop()
  lastName?: string

  @prop()
  age?: number
}

@modelOptions({
  schemaOptions: { timestamps: true },
})
class Message {
  @prop({ required: true })
  text!: string

  @prop({ ref: () => Author, index: true, required: true })
  author!: Ref<Author>
}

export const MessageModel = getModelForClass(Message)
export const AuthorModel = getModelForClass(Author)
