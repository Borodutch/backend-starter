import { IsEmail, IsString } from 'amala'

export default class EmailLogin {
    @IsEmail()
    email!: string

    @IsString()
    name!: string
}