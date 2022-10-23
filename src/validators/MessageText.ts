import { IsString } from 'amala'

export default class messageText {
  @IsString()
  text!: string
}
