import { IsNotEmpty, IsString } from 'amala'

export default class MessageText {
  @IsNotEmpty()
  @IsString()
  text!: string
}
