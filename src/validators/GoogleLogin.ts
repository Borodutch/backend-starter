import { IsString } from 'amala'

export default class GoogleLogin {
	@IsString()
	accessToken!: string
}
