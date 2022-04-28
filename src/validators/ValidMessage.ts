import { IsString } from 'amala'

export default class ValidMessage {
  @IsString()
  text!: string
}
