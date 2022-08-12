import { IsString } from 'amala'

export default class MessageValid {
  @IsString()
  text!: string
}
