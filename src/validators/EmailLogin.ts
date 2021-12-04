import { IsEmail, IsString } from 'class-validator'

export default class Email {
  @IsEmail()
  email!: string
  @IsString()
  name!: string
}
