import { IsMongoId, IsString } from 'amala'

export class MessageUserIdTextValidator {
  @IsMongoId()
  userId!: string
  @IsString()
  text!: string
}

export class MessageTextValidator {
  @IsString()
  text!: string
}

export class MessageIdValidator {
  @IsMongoId()
  messageId!: string
}
