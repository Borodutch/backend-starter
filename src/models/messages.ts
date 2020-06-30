const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema and model based on it
const messageSchema = new Schema({
  content: String,
  user: { type: String, required: [true, 'Username is required'] },
});
// Create new model based on messageSchema
const Message = mongoose.model('message', messageSchema);

module.exports = Message;
