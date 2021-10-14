import * as jwt from 'jsonwebtoken'

const secret = process.env.JWT

export function sign(payload: Record<string, unknown>) {
  return new Promise((res, rej) => {
    jwt.sign(payload, secret, undefined, (err, token) => {
      return err ? rej(err) : res(token)
    })
  })
}

export function verify(token: string) {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, undefined, (err, payload) => {
      return err ? rej(err) : res(payload)
    })
  })
}
