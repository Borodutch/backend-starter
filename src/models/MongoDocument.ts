export default class MongoDocument<T> {
  _doc: T
  createdAt: Date
  updatedAt: Date
}
