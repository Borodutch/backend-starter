import { IsString } from 'amala'

export default class MessageText {
  @IsString()
  text!: string
}
