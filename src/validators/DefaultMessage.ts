import { IsString } from 'amala'

export default class MessageValidatorDefault {
  @IsString()
  text!: string
  @IsString()
  author!: string
}
