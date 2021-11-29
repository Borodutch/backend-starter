import { IsNotEmpty, IsString } from 'amala'

export default class MessageValidator {
  @IsString()
  @IsNotEmpty()
  text!: string
}
