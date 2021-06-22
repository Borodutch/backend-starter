"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTelegramPayload = void 0;
const crypto = require("crypto");
function verifyTelegramPayload(payload) {
    const secret = crypto
        .createHash('sha256')
        .update(process.env.TELEGRAM_LOGIN_TOKEN)
        .digest();
    const hash = payload.hash;
    delete payload.hash;
    const check = crypto
        .createHmac('sha256', secret)
        .update(Object.keys(payload)
        .map((key) => `${key}=${payload[key]}`)
        .sort()
        .join('\n'))
        .digest('hex');
    return hash === check ? Object.assign(payload, { hash }) : false;
}
exports.verifyTelegramPayload = verifyTelegramPayload;
//# sourceMappingURL=verifyTelegramPayload.js.map