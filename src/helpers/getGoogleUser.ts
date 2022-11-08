import axios from 'axios'

interface GoogleResponse {
  name: string
  email: string
}

export default async function getGoogleUser(
  accessToken: string
): Promise<GoogleResponse> {
  return (
    await axios(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    )
  ).data
}
