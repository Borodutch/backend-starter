import { IsString } from 'amala'

export default class MessageContentPayload {
  @IsString()
  text!: string
}
