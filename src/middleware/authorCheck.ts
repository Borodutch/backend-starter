import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'
import { MessageModel } from '@/models/message'
import { isEqual } from 'lodash'

export const authorCheck = async (id_: string, user: Ref<User>) => {
  const message = await MessageModel.find({ _id: id_ })
  return isEqual(message[0].author, user._id)
}
