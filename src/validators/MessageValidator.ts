import { IsOptional, IsString } from 'amala'

export default class MessageValidator {
  @IsString()
  text!: string
  @IsOptional()
  @IsString()
  author?: string
}
