// Setup typegoose
import { setGlobalOptions, Severity } from '@typegoose/typegoose'
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
app.listen(5000).on('listening', () => {
  console.log('HTTP is listening on 5000')
})
