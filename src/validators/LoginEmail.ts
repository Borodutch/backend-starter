import { IsEmail, IsString } from 'amala'

export default class LoginEmail {
  @IsEmail()
  email!: string

  @IsString()
  name!: string
}
