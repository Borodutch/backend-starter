import { IsString } from 'amala'

export default class MessageTextValidator {
  @IsString()
  text!: string
}
