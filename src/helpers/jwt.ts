import * as jwt from 'jsonwebtoken'
import env from '@/helpers/env'

export function sign(payload: Record<string, unknown>) {
  return new Promise<string>((res, rej) => {
    try {
      jwt.sign(payload, env.JWT, (err, token) => {
        return err
          ? rej(err)
          : token
          ? res(token)
          : rej(new Error('No token was created'))
      })
    } catch (error) {
      rej(error)
    }
  })
}

export function verify(token: string) {
  return new Promise((res, rej) => {
    try {
      jwt.verify(token, env.JWT, undefined, (err, payload) => {
        return err ? rej(err) : res(payload)
      })
    } catch (error) {
      rej(error)
    }
  })
}
