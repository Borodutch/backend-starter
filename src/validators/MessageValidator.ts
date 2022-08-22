import { IsMongoId, IsString } from 'amala'

export class MessageTextValidator {
  @IsString()
  text!: string
}

export class MessageIdValidator {
  @IsMongoId()
  id!: string
}
