import { getModelForClass, prop } from '@typegoose/typegoose'

export class Messages {
  @prop()
  text!: string
}
export const Message = getModelForClass(Messages)
