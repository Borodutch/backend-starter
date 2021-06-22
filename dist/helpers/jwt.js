"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT;
function sign(payload) {
    return new Promise((res, rej) => {
        jwt.sign(payload, secret, undefined, (err, token) => {
            return err ? rej(err) : res(token);
        });
    });
}
exports.sign = sign;
function verify(token) {
    return new Promise((res, rej) => {
        jwt.verify(token, secret, undefined, (err, payload) => {
            return err ? rej(err) : res(payload);
        });
    });
}
exports.verify = verify;
//# sourceMappingURL=jwt.js.map