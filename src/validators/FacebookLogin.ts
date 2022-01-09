import { IsString } from 'amala'

export default class FacebookLogin {
  @IsString()
  accessToken!: string
}
