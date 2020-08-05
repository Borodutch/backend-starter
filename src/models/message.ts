const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    message: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
