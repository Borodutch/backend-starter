import { MinLength, IsString } from 'amala'

export default class CreateMessagesInput {
  @IsString()
  @MinLength(1, {
    message: 'Message should have at least 1 character'
  })
  text!: string
}
