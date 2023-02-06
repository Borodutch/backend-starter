const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message_Schema = new Schema({
  text_field: {
    type: String,
    required: true,
  },
})

mongoose.model('message collection', Message_Schema)
