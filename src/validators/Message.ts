import { IsString } from 'amala'

export class CreateMessage {
  @IsString()
  text!: string
}

export class UpdateMessage {
  @IsString()
  text!: string
}

export class IdMessage {
  @IsString()
  id!: string
}
