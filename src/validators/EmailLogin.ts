import { IsEmail, IsNotEmpty, IsString } from 'amala'

export default class EmailLogin {
  @IsEmail()
  email: string
  @IsString()
  @IsNotEmpty()
  name: string
}
