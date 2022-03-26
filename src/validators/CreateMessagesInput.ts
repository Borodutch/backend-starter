import { IsObject } from 'amala'

class CreateMessagesInput {
  @IsObject()
  name!: string
  text!: string
}

export default CreateMessagesInput
