import { IsString } from 'amala'

export default class EmailLogin {
  @IsString()
  email!: string
  @IsString()
  name!: string
}
