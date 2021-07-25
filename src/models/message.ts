import { sign } from '@/helpers/jwt'
import { prop, getModelForClass, DocumentType} from '@typegoose/typegoose'
import * as mongoose from 'mongoose';
import { omit } from 'lodash'

export class Message {
  @prop({ required: true})
  text: string

  @prop({ required: true})
  user_id: mongoose.Types.ObjectId
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
