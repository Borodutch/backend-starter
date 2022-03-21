import { IsOptional, IsString } from 'amala'
import { User } from '@/models/User'

export default class Message {
  userId!: User
  @IsString()
  data!: string
  @IsOptional()
  @IsString()
  username?: string
  @IsOptional()
  @IsString()
  companyName?: string
  @IsOptional()
  @IsString()
  author?: string
  @IsOptional()
  @IsString()
  sourceUrl?: string
}
