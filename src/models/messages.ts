const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema and model based on it
const messageSchema = new Schema({
    content: String,
    user: String
});
// Create new model based on messageSchema
const Message = mongoose.model('message', messageSchema) 

module.exports = Message; 

