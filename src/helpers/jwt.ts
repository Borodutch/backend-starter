import { sign as signBase, verify as verifyBase } from 'jsonwebtoken'
import env from '@/helpers/env'

interface UserPayload {
  _id: string
}

export function sign(payload: UserPayload) {
  return signBase(payload, env.JWT)
}

export function verify(token: string) {
  return verifyBase(token, env.JWT) as UserPayload
}
