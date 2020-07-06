const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  date: {
    type: Date,
    default: new Date()
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    default: ''
  }
})

module.exports = mongoose.model('Message', Schema)