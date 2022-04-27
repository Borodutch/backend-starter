import { Schema } from "mongoose"
import * as mongoose from "mongoose"

export const MsgSchema = new Schema ({
    msg: {
        type: String
    }
})
export const Msg = mongoose.model('msg', MsgSchema)