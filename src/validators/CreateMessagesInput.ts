import { IsOptional, IsString } from 'amala'

export default class CreateMessagesInput {
  @IsString()
  text!: string
  @IsOptional()
  @IsString()
  author?: string
  @IsString()
  _id!: string
}
