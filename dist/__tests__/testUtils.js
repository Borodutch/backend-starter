"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeUser = exports.stopServer = exports.startKoa = exports.dropMongo = void 0;
const mongoose = require("mongoose");
function dropMongo() {
    return Promise.all(Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})));
}
exports.dropMongo = dropMongo;
function startKoa(app) {
    return new Promise((res, rej) => {
        const connection = app
            .listen()
            .on('listening', () => {
            res(connection);
        })
            .on('error', rej);
    });
}
exports.startKoa = startKoa;
function stopServer(server) {
    return new Promise((res) => {
        server.close(() => {
            res();
        });
    });
}
exports.stopServer = stopServer;
exports.completeUser = {
    name: 'Alexander Brennenburg',
    email: 'alexanderrennenburg@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxleGFuZGVyIEJyZW5uZW5idXJnIiwic3Vic2NyaXB0aW9uU3RhdHVzIjoidHJpYWwiLCJkZWxlZ2F0ZUludml0ZVRva2VuIjoiR090WWwyRUVaSE1OMmF1cSIsImVtYWlsIjoiYWxleGFuZGVycmVubmVuYnVyZ0BnbWFpbC5jb20iLCJpYXQiOjE2MDUxMjY5MTF9.Z17DwU2HuIcqBgvrzl65X47q3iRMuvybbYLmz9yc5ns',
    _doc: '1',
};
//# sourceMappingURL=testUtils.js.map