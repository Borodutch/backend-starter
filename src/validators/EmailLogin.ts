import { IsEmail, IsString } from 'class-validator'

export default class EmailLogin {
  @IsEmail()
  email: string
  @IsString()
  name: string
}
