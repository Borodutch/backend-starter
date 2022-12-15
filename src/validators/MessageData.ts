import { IsString } from 'amala'

export default class MessageData {
  @IsString()
  text!: string
}
