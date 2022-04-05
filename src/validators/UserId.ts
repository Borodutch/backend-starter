import { IsOptional, IsString } from 'amala'
import { User } from '@/models/User'

export default class UserId extends User {
  @IsString()
  @IsOptional()
  _id?: string
}
