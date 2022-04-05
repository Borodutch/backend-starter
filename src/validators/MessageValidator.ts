import { IsString } from 'amala'

export default class MessageValidator {
  @IsString()
  text!: string
  @IsString()
  author!: string
}
