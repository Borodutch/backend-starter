import { getModelForClass, prop } from '@typegoose/typegoose'

export class Messages {
  @prop()
  message?: string
}
export const Msg = getModelForClass(Messages)
