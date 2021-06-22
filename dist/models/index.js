"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopMongo = exports.runMongo = void 0;
const mongoose = require("mongoose");
function runMongo(mongoUrl = process.env.MONGO) {
    return mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
    });
}
exports.runMongo = runMongo;
function stopMongo() {
    return mongoose.disconnect();
}
exports.stopMongo = stopMongo;
//# sourceMappingURL=index.js.map