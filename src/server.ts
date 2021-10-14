// Setup typegoose
import { Severity, setGlobalOptions } from '@typegoose/typegoose'
setGlobalOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import { app } from '@/app'
import { runMongo } from '@/models/index'

// Run mongo
runMongo().then(() => {
  console.log('Mongo connected')
})
// Start rest
const port = process.env.PORT || 1337
app.listen(port).on('listening', () => {
  console.log(`HTTP is listening on ${port}`)
})
