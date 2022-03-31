import { IsString } from 'amala'

export default class TextValid {
  @IsString()
  text!: string
}
