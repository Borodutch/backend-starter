import { badData } from '@hapi/boom'
import isMongoId from 'validator/lib/isMongoId'

export default function (id: string, error: string) {
  if (!isMongoId(id)) {
    throw badData(error)
  }
}
