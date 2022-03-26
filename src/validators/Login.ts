import { IsObject, IsString } from 'amala'

class Login {
  @IsObject()
  name!: string
  @IsString()
  headers!: string
  email!: string
  id!: string
}

export default Login
