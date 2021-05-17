import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User, UserModel } from './user';

export class Message {
  @prop({ ref: () => User, required: true, index: true })
  userId?: string;

  @prop({ required: true })
  note?: string;

  // Mongo property
  _doc: any;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});
