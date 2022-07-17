import { IsNumber, IsOptional, IsString } from 'amala'

export default class UserId {
  @IsString()
  name!: string
  @IsOptional()
  @IsString()
  email?: string
  @IsOptional()
  @IsString()
  facebookId?: string
  @IsOptional()
  @IsNumber()
  telegramId?: number
  @IsOptional()
  @IsString()
  token?: string
}
