const assert = require('assert');
const Message = require('../dist/models/messages');

// Describe our tests
describe('Deleting records', () => {
    // Add an entry in the collection before running the test
    let entry;
    beforeEach(done => {
        entry = new Message({
            content: 'deleting message',
            user: 'Mike'
        });
        entry.save().then(() => {
            done();
        })
    })

    // Create deleting test
    it ('Deletes one record in the database', done => {
        Message.findOneAndRemove({user: 'Mike'}).then(() => {
            Message.findOne({user: 'Mike'}).then(result => {
                assert(result === null);
                done();
            })
        })
    })
})