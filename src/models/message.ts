import { prop, getModelForClass } from "@typegoose/typegoose";

class Message {
  @prop({ required: true })
  body: string;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});
