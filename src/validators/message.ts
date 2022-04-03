import { IsString } from 'amala'

export default class MessageObject {
  @IsString()
  text!: string
  @IsString()
  author!: string
}
