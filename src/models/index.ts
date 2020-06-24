import * as mongoose from 'mongoose'
const Message = require('../models/messages')

// Connect to mongoose
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

// Export models
export * from './user'

// log successful database connection
mongoose.connection.once('open', () => {
    console.log('sucessfully connected to messagesDB');
}).on('error', err => {
    console.log('Error occured: ', err);
})

// create new entry object to add to the DB
let entry = new Message({
  content: 'user message',
  user: 'Alex',
})

// saving entry to messages collection
entry.save().then(() => {
  console.log("Alex's message successfully saved to the database")

  // finding by name
  Message.findOne({user: 'Alex'}).then(result => {
    result.user === 'Alex' ? console.log('Alex was found') : console.log('Alex is missing');

    // updating entry
    Message.findOneAndUpdate({user: 'Alex'}, {content: 'this is new user message instead of the old one'}).then(() => {
      Message.findOne({content: 'this is new user message instead of the old one'}).then(result => {
        result ? console.log("Alex's message was updated") : console.log("Failed to update Alex's message");

        // removing entry
        Message.findOneAndRemove({user: 'Alex'}).then(() => {
          console.log('message by Alex has been found and removed');
        })
      })
    })
  })
})



