import { IsString } from 'amala'

export default class MsgValidator {
  @IsString()
  text!: string
}
