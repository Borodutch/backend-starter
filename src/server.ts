import 'module-alias/register'
import 'source-map-support/register'
import { Severity, setGlobalOptions } from '@typegoose/typegoose'

import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

setGlobalOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  await runApp()
})()
