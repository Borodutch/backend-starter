import { IsString } from 'amala'
import { User } from '@/models/User'

export default class UserId extends User {
  @IsString()
  _id!: string
}
