import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  await runApp()
})()
