import * as mongoose from "mongoose";

// Connect to mongoose
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Database connected"))
  .catch((err) => console.log(err));

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// Export models
export * from "./user";
