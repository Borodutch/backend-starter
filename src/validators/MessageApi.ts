import { User } from '@/models/user'
import { Ref } from '@typegoose/typegoose'
import { IsString } from 'amala'
import { Message } from '@/models/message'

export default class MessageApi {
  @IsString()
  name!: Ref<User>
  @IsString()
  content!: string
  @IsString()
  id?: Ref<Message>
}
