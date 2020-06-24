const assert = require('assert');
const Message = require('../dist/models/messages');

// Describe our tests
describe('Finding records', () => {
    // Add an entry in the collection before running the test
    let entry;
    beforeEach(done => {
        entry = new Message({
            content: 'finding messages',
            user: 'Mike'
        });
        entry.save().then(() => {
            done();
        })
    })

    // Create finding test (by user name)
    it ('Finds one record in the database', done => {
        Message.findOne({user: 'Mike'}).then(result => {
            assert(result.user === 'Mike');
            done();
        })
    })

    // Create finding test (by user ID)
    it ('Finds one record in the database by ID', done => {
        Message.findOne({_id: entry._id}).then(result => {
            assert(result._id.toString() === entry._id.toString());
            done();
        })
    })
})