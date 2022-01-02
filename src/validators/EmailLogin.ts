import { IsString } from 'amala'

export default class EmailLogin {
  @IsString()
  name!: string
  @IsString()
  email!: string
}
