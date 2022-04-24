import { IsString } from 'amala'

export default class CorrectMessage {
  @IsString()
  postingDate?: string
  @IsString()
  authorName?: string
  @IsString()
  messageBody?: string
}