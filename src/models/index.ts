import * as mongoose from 'mongoose'
import messgModel from './schema';


export function runMongo(mongoUrl =process.env.MONGO
) {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  

  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false) 
 
}
