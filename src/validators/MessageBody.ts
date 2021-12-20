import { IsString } from 'amala'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export default class MessageBody {
  @IsString()
  author!: Ref<User>
  @IsString()
  text?: string
}
