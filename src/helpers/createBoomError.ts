import { Boom } from '@hapi/boom'

export default function createBoomError(
  statusCode: number,
  error: string,
  message?: string
) {
  const err = new Boom()
  err.output.payload = {
    statusCode,
    error,
    message: message || '',
  }
  err.output.statusCode = statusCode
  return err
}
