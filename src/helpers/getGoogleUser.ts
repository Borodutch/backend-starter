import axios from 'axios'
import isTesting from '@/helpers/isTesting'
import testingGoogleMock from '@/helpers/testingGoogleMock'

interface GoogleResponse {
  name: string
  email: string
}

export default async function getGoogleUser(
  accessToken: string
): Promise<GoogleResponse> {
  return isTesting()
    ? testingGoogleMock
    : (
        await axios(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
        )
      ).data
}
