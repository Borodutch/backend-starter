import * as Facebook from 'facebook-node-sdk'
import FBUser from '@/models/FBUser'
import env from '@/helpers/env'

export default function getFBUser(accessToken: string): Promise<FBUser> {
  return new Promise((res, rej) => {
    const fb = new Facebook({
      appID: env.FACEBOOK_APP_ID,
      secret: env.FACEBOOK_APP_SECRET,
    })
    fb.setAccessToken(accessToken)
    fb.api('/me?fields=name,email,id', (err: Error, user: FBUser) => {
      return err ? rej(err) : res(user)
    })
  })
}
