import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';

export class Message {
  @prop({ index: true, required: true })
  text?: string;

  // Mongo property
  _doc: any;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});

export async function addMessage(messageText: string) {
  let message: DocumentType<Message> | undefined;

  message = await new MessageModel({
    text: messageText,
  }).save();

  return message;
}

export async function deleteMessage(id: string) {
  return await MessageModel.findByIdAndDelete(id);
}

export async function updateMessage(id: string, messageText: string) {
  return await MessageModel.findByIdAndUpdate(
    id,
    { text: messageText },
    { new: true, useFindAndModify: false }
  );
}

export async function getMessages() {
  return await MessageModel.find();
}

export async function getMessage(id: string) {
  return await MessageModel.findById(id);
}
