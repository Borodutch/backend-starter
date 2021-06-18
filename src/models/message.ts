import { prop, getModelForClass } from "@typegoose/typegoose";

class Message {
  @prop({ required: true })
  body: string;

  @prop({ required: true })
  author: string;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});
