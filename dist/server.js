"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Setup typegoose
const typegoose_1 = require("@typegoose/typegoose");
typegoose_1.setGlobalOptions({
    options: {
        allowMixed: typegoose_1.Severity.ALLOW,
    },
});
require("module-alias/register");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../.env` });
const app_1 = require("@/app");
const index_1 = require("@/models/index");
// Run mongo
index_1.runMongo().then(() => {
    console.log('Mongo connected');
});
// Start rest
app_1.app.listen(1337).on('listening', () => {
    console.log('HTTP is listening on 1337');
});
//# sourceMappingURL=server.js.map