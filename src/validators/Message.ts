import { IsOptional, IsString } from 'amala'

export default class Message {
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
