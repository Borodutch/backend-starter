import { IsObject } from 'amala'

class createMessagesInput {
  @IsObject()
  body: {
    name: string
    text: string
  }
}

export default createMessagesInput
