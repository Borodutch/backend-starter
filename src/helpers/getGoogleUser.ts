import axios from 'axios'
import env from '@/helpers/env'
import testingGoogleMock from '@/helpers/testingGoogleMock'

interface GoogleResponse {
  name: string
  email: string
}

export default async function getGoogleUser(
  accessToken: string
): Promise<GoogleResponse> {
  return env.isTest
    ? testingGoogleMock
    : (
        await axios(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
        )
      ).data
}
