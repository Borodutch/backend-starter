import { getModelForClass, prop } from '@typegoose/typegoose'

class Messages {
    @prop({ required: true })
    public postingDate?: string
  
    @prop({ required: true })
    public authorName?: string

    @prop({ required: true })
    public messageBody?: string
  }

export const Message = getModelForClass(Messages)