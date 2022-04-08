import { IsEmail, IsMongoId, IsString } from 'amala'

export default class UserValidator {
  @IsMongoId()
  _id!: string
  @IsEmail()
  email!: string
  @IsString()
  name!: string
}
