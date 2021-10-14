import { IsString } from 'class-validator'

export default class FacebookLogin {
  @IsString()
  accessToken: string
}
