import { IsNumber, IsOptional, IsString } from 'amala'

export default class TelegramLogin {
  @IsNumber()
  id!: number
  @IsString()
  hash!: string
  @IsString()
  auth_date!: string
  @IsOptional()
  @IsString()
  first_name?: string
  @IsOptional()
  @IsString()
  last_name?: string
  @IsOptional()
  @IsString()
  username?: string
  @IsOptional()
  @IsString()
  photo_url?: string
}
