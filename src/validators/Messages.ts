import { IsString } from 'amala'

export default class MessageValidator {
  @IsString()
  textMessage!: string
}
