import { IsString } from 'amala'

export default class MessageValid {
  @IsString()
  message!: string
}
