import { IsEmail } from 'amala'

export default class EmailLogin {
  @IsEmail()
  email!: string
}
