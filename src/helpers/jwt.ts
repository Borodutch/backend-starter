import * as jwt from 'jsonwebtoken'

function getSecret() {
  const secret = process.env.JWT
  if (!secret) {
    throw new Error('JWT is not defined')
  }
  return secret
}

export function sign(payload: Record<string, unknown>) {
  return new Promise<string>((res, rej) => {
    try {
      jwt.sign(payload, getSecret(), (err, token) => {
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
      jwt.verify(token, getSecret(), undefined, (err, payload) => {
        return err ? rej(err) : res(payload)
      })
    } catch (error) {
      rej(error)
    }
  })
}
