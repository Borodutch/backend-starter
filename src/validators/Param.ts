import { User } from '@/models/user'
import { Ref } from '@typegoose/typegoose'
import { IsString } from 'amala'
import { Message } from '@/models/message'

export default class ParamsOptions {
  @IsString()
  _id?: string
}
