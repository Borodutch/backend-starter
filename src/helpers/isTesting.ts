export default function isTesting() {
  return process.env.NODE_ENV === 'test'
}
