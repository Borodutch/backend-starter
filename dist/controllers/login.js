"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const user_1 = require("@/models/user");
const amala_1 = require("amala");
const Facebook = require("facebook-node-sdk");
const verifyTelegramPayload_1 = require("@/helpers/verifyTelegramPayload");
let LoginController = class LoginController {
    facebook(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const fbProfile = yield getFBUser(ctx.request.body.accessToken);
            const user = yield user_1.getOrCreateUser({
                name: fbProfile.name,
                email: fbProfile.email,
                facebookId: fbProfile.id,
            });
            return user.strippedAndFilled(true);
        });
    }
    telegram(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = ctx.request.body;
            // verify the data
            if (!verifyTelegramPayload_1.verifyTelegramPayload(data)) {
                return ctx.throw(403);
            }
            const user = yield user_1.getOrCreateUser({
                name: `${data.first_name}${data.last_name ? ` ${data.last_name}` : ''}`,
                telegramId: data.id,
            });
            return user.strippedAndFilled(true);
        });
    }
    google(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = ctx.request.body.accessToken;
            const userData = process.env.TESTING === 'true'
                ? testingGoogleMock()
                : (yield axios_1.default(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`)).data;
            const user = yield user_1.getOrCreateUser({
                name: userData.name,
                email: userData.email,
            });
            return user.strippedAndFilled(true);
        });
    }
};
__decorate([
    amala_1.Post('/facebook'),
    __param(0, amala_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "facebook", null);
__decorate([
    amala_1.Post('/telegram'),
    __param(0, amala_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "telegram", null);
__decorate([
    amala_1.Post('/google'),
    __param(0, amala_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "google", null);
LoginController = __decorate([
    amala_1.Controller('/login')
], LoginController);
exports.default = LoginController;
function getFBUser(accessToken) {
    return new Promise((res, rej) => {
        const fb = new Facebook({
            appID: process.env.FACEBOOK_APP_ID,
            secret: process.env.FACEBOOK_APP_SECRET,
        });
        fb.setAccessToken(accessToken);
        fb.api('/me?fields=name,email,id', (err, user) => {
            return err ? rej(err) : res(user);
        });
    });
}
function testingGoogleMock() {
    return {
        name: 'Alexander Brennenburg',
        email: 'alexanderrennenburg@gmail.com',
    };
}
//# sourceMappingURL=login.js.map