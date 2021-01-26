import { ObjectId, ObjectID } from 'mongodb';
import * as mongoose from 'mongoose'
const Schema = mongoose.Schema;
//save
const messgSchema = new Schema(
    {
        //_id: ObjectId,
        title: String,
        body: String
    },
    {
        timestamps: true
    }
)
const messgModel = mongoose.model('message', messgSchema)
export default messgModel

//read

// const readSchema = new Schema(
//     {
//         _id: ObjectId,
//         title: String,
//         message: String
//     },
//     {
//         timestamps: true
//     }
// )
// export const readModel = mongoose.model('?', readSchema)
 