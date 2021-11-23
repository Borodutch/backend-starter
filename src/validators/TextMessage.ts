import { IsString } from 'amala'

export default class TextMessage {
  @IsString()
  text: string
}
