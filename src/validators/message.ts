import { IsEmail, IsMongoId } from 'class-validator'
import { IsNumber, IsString } from 'amala'

export class ValidatorForBody {
  @IsString()
  text: string
}

export class ValidatorForId {
  @IsMongoId()
  id: string
}

export class ValidatorForUser {
  @IsString()
  name: string
  @IsEmail()
  email: string
  @IsNumber()
  iat: number
}
