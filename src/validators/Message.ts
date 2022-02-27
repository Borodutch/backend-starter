import { IsNumber, IsOptional, IsString } from 'amala'

export default class Message {
  @IsNumber()
  user_id!: number
  @IsString()
  data!: string
  @IsOptional()
  @IsString()
  username?: string
  @IsOptional()
  @IsString()
  company_name?: string
  @IsOptional()
  @IsString()
  author?: string
  @IsOptional()
  @IsString()
  source_url?: string
}
