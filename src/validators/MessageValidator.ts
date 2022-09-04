import { IsString } from 'amala'

export class MessageValidatorDefault {
  @IsString()
  content!: string
  @IsString()
  type!: string
}

export class MessageValidatorUpdate {
  @IsString()
  content!: string
  @IsString()
  type!: string
  @IsString()
  _id!: string
}

export class MessageValidatorDelete {
  @IsString()
  _id!: string
}
