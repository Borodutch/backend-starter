import { IsString } from 'amala'

export default class MessageValidator {
  @IsString()
  author!: string
  @IsString()
  text!: string
}
