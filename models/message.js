const mongoose = require('mongoose');
const Schema = mongoose.Schema

// create message schema and model
const MessageSchema = new Schema({
    posting_date: {
        type: Date
    },
    author_name: {
        type: String,
        required: [true, 'Name field is require']
    },
    message_body: {
        type: String
    }
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;