const assert = require('assert');
const Message = require('../dist/models/messages');

// Describe our tests
describe('Saving records to messages DB', () => {

    // Create tests
    it('Saves a record to database', (done) => {
  
      const entry = new Message({
        content: 'testing...',
        user: 'Alex'
      });
  
      entry.save().then(() => {
        assert(!entry.isNew); // check if our entry is not new, then it is in database
        done(); // end of the test
      });
    });
  });