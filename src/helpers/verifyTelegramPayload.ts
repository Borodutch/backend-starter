import * as crypto from 'crypto'

export interface TelegramLoginPayload {
  id: number
  hash: string
  auth_date: string
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
}

export function verifyTelegramPayload(payload: TelegramLoginPayload) {
  const secret = crypto
    .createHash('sha256')
    .update(process.env.TELEGRAM_LOGIN_TOKEN)
    .digest()
  const hash = payload.hash
  delete payload.hash
  const check = crypto
    .createHmac('sha256', secret)
    .update(
      Object.keys(payload)
        .map((key: keyof TelegramLoginPayload) => `${key}=${payload[key]}`)
        .sort()
        .join('\n')
    )
    .digest('hex')
  return hash === check ? Object.assign(payload, { hash }) : false
}
