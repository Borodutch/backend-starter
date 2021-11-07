export default class MongoDocument<T> {
  _id: string
  _doc: T
  createdAt: Date
  updatedAt: Date
}
