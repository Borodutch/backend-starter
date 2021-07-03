import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './user'

//model for user message
export class UserMessage {
  @prop({ required: false })
  user: Ref<User>
  @prop({ required: true })
  message: string
}

export const UserMessageModel = getModelForClass(UserMessage)

//get message
export async function getUserMessage(id?: string) {
  if (id) {
    return await UserMessageModel.find({ _id: id }, (err, data) => {
      if (err) throw err
      return data
    })
  } else {
    return await UserMessageModel.find({}, (err, data) => {
      if (err) throw err
      return data
    })
  }
}
//add message
export async function createUserMessage(message: string): Promise<UserMessage> {
  const { _id: id } = await UserMessageModel.create({ message } as UserMessage)
  const userMessage = await UserMessageModel.findById(id).exec()
  return userMessage
}

//delete message
export async function deleteUserMessage(id: string[]) {
  let userMessages: UserMessage[] = []
  if (typeof id === 'string') {
    await UserMessageModel.findByIdAndDelete({ _id: id }, (err, data) => {
      if (err) throw err
      userMessages.push(data)
    })
  } else {
    for (let i = 0; i < id.length; i++) {
      await UserMessageModel.findByIdAndDelete({ _id: id[i] }, (err, data) => {
        if (err) throw err
        userMessages.push(data)
      })
    }
    return userMessages
  }
}

//change message
export async function changeUserMessage(id: string, message: string) {
  return await UserMessageModel.findOneAndUpdate(
    { _id: id },
    { message: message },
    { useFindAndModify: false },
    (err, data) => {
      if (err) throw err
      return data
    }
  )
}
