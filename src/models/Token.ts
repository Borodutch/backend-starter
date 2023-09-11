import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Token {
  @prop({ index: true, unique: true })
  token!: string
}

export const TokenModel = getModelForClass(Token)
