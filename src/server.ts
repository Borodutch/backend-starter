import 'module-alias/register'
import 'source-map-support/register'
import { runMongo } from '@/helpers/mongo'
import app from '@/app'
import env from '@/helpers/env'

// Run mongo
void runMongo().then(() => {
  console.log('Mongo connected')
})
// Start rest
app.listen(env.PORT).on('listening', () => {
  console.log(`HTTP is listening on ${env.PORT}`)
})
