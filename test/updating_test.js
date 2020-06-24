const assert = require('assert');
const Message = require('../dist/models/messages');

// Describe our tests
describe('Updating records', () => {
    // Add an entry in the collection before running the test
    let entry;
    beforeEach(done => {
        entry = new Message({
            content: 'updating user',
            user: 'Mike'
        });
        entry.save().then(() => {
            done();
        })
    })

    // Create updating test
    it ('Updates one record in the database', done => {
        Message.findOneAndUpdate({user: 'Mike'}, {user: 'Luke'}).then(() => {
            Message.findOne({_id: entry._id}).then(result => {
                assert(result.user === 'Luke');
                done();
            })
        })
    })
})