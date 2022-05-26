import * as mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
}, {timestamps: true});

export const Messages = mongoose.model('message', messageSchema);