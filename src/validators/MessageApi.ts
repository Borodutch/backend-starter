import { IsString } from 'amala'
import { Message } from '@/models/message'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export default class MessageApi {
  @IsString()
  name?: Ref<User>
  @IsString()
  content!: string
  @IsString()
  id?: Ref<Message>
}
