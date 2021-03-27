import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
    
});

messageSchema.post('save', (doc, next) => {
    console.log('new message was created');
    next();
})

export const Message = mongoose.model('message', messageSchema);
