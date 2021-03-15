import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";

export class Message {
  @prop({ index: true, lowercase: true })
  title: String;
  @prop({ index: true, lowercase: true })
  body: String;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});

export async function getOrCreateMessage(msg: Message) {
  if (!msg.title && !msg.body) {
    throw new Error();
  }

  let message: DocumentType<Message> | undefined;
  const params = {
    title: msg.title,
    body: msg.body,
  } as any;
  if (msg.title) {
    params.title = msg.title;
  }
  if (msg.body) {
    params.body = msg.body;
  }

  message = await new MessageModel({
    ...params,
  }).save();

  return message;
}
