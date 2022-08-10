import { IsObject } from 'amala'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'

export default class AuthorValid {
  @IsObject()
  author!: Ref<User>
}
