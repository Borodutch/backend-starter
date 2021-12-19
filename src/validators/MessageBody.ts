import { IsString } from 'amala'
import { Message } from '@/models/message'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export default class MessageBody {
  @IsString()
  author?: Ref<User>
  @IsString()
  text!: string
}
