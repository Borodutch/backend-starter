import { IsString } from 'amala'

export class MessageValidator {
  @IsString()
  text!: string
}
export class MessageIdValidator {
  @IsString()
  message_id!: string
}
