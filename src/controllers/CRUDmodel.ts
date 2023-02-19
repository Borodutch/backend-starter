const mongoose = require('mongoose')
const Schema2 = mongoose.Schema

const Message_Schema = new Schema2({
  text_field: {
    type: String,
    required: true,
  },
})

mongoose.model('message collection 333', Message_Schema)
