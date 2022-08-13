import { IsString, IsEmail } from 'amala'

export default class Login {
  @IsString()
  name!: string

  @IsEmail()
  email?: string
}
