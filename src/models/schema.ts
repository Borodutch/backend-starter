import { ObjectId, ObjectID } from 'mongodb';
import * as mongoose from 'mongoose'
const Schema = mongoose.Schema;

const messgSchema = new Schema(
    {
        
        title: String,
        body: String
    },
    {
        timestamps: true
    }
)
const messgModel = mongoose.model('message', messgSchema)
export default messgModel