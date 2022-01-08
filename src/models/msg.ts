import {prop, getModelForClass, modelOptions} from '@typegoose/typegoose'

@modelOptions({schemaOptions: {timestamps: true}})
class Msg {
	@prop({required: true})
	txt!: string
}

const MsgModel = getModelForClass(Msg)

export const getMsgs = async () => {
	return await MsgModel.find({})
}

export const createMsg = async (txt: string) => {
	return await new MsgModel({txt}).save()
}

export const deleteMsg = async (id: string) => {
	return await MsgModel.deleteOne({_id: id}).exec()
}

export const updateMsg = async (id: string, updatedTxt: string) => {
	return await MsgModel.findOneAndUpdate({_id: id}, {txt: updatedTxt})
}
