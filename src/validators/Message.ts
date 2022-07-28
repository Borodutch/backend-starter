import { IsString } from 'amala'

export class Message {
  @IsString()
  text!: string
}

export class IdMessage {
  @IsString()
  id!: string
}
