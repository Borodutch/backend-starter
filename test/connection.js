const mongoose = require('mongoose');

// Use ES6 Promises
mongoose.Promise = global.Promise;

// Connect to DB before running tests (mocha hook)
before((done) => {

    // Connect to mongodb
    mongoose.connect('mongodb://localhost/messagesDB');

    mongoose.connection.once('open', function(){
        console.log('Connection has been made...');
        done();
    }).on('error', function(error){
        console.log('Connection error:', error);
    });
})

// Emptying colletion (code runs before any test)
beforeEach(done => {
    // drop the collection
    mongoose.connection.collections.messages.drop(() => {
        console.log('collection emptied')
        done();
    })
})