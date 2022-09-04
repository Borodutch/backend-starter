import { IsString } from 'amala'

export default class MessageValidatorUpdate {
  @IsString()
  text!: string
  @IsString()
  _id!: string
}
