import { IsEmail, IsString } from 'amala'

export default class EmailLogin {
  @IsString()
  name!: string
  @IsEmail()
  email!: string
}
