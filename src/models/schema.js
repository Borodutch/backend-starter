const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// this file is responsible for Schema & model
// create Schema (how our data looks)
const GeorgeSchema = new Schema({
    name:{
        type: String,
        required: (true, 'Name field is required')
    },
    message: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    }
});

// create model (creates a collection based on our Schema)
const George = mongoose.model('george', GeorgeSchema);

// we are exporting model to use in other files
module.exports = George;