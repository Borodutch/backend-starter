import { IsString } from 'amala'

export default class TodoType {
  @IsString()
  title: string
  @IsString()
  body: number
}
