import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
	@prop({ required: true })
	text!: string
}

const MessageModel = getModelForClass(Message)

export const getMessages = async () => {
	await MessageModel.find({})
}

export const createMessage = async (text: string) => {
	await new MessageModel({ text }).save()
}

export const deleteMessage = async (id: string) => {
	await MessageModel.deleteOne({ _id: id }).exec()
}

export const updateMessage = async (id: string, updatedText: string) => {
	await MessageModel.findOneAndUpdate({ _id: id }, { text: updatedText })
}
