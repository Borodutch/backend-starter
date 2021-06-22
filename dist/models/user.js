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
exports.getOrCreateUser = exports.UserModel = exports.User = void 0;
const jwt_1 = require("@/helpers/jwt");
const typegoose_1 = require("@typegoose/typegoose");
const lodash_1 = require("lodash");
class User {
    strippedAndFilled(withExtra = false, withToken = true) {
        const stripFields = ['createdAt', 'updatedAt', '__v'];
        if (!withExtra) {
            stripFields.push('token');
            stripFields.push('email');
            stripFields.push('facebookId');
            stripFields.push('telegramId');
        }
        if (!withToken) {
            stripFields.push('token');
        }
        return lodash_1.omit(this._doc, stripFields);
    }
}
__decorate([
    typegoose_1.prop({ index: true, lowercase: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ index: true, lowercase: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    typegoose_1.prop({ index: true, lowercase: true }),
    __metadata("design:type", String)
], User.prototype, "telegramId", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
exports.User = User;
exports.UserModel = typegoose_1.getModelForClass(User, {
    schemaOptions: { timestamps: true },
});
function getOrCreateUser(loginOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!loginOptions.name) {
            throw new Error();
        }
        let user;
        // Try email
        if (loginOptions.email) {
            user = yield exports.UserModel.findOne({ email: loginOptions.email });
        }
        // Try facebook id
        if (!user && loginOptions.facebookId) {
            user = yield exports.UserModel.findOne({
                facebookId: loginOptions.facebookId,
            });
        }
        // Try telegram id
        if (!user && loginOptions.telegramId) {
            user = yield exports.UserModel.findOne({
                telegramId: loginOptions.telegramId,
            });
        }
        if (!user) {
            // Check if we have credentials
            if (!(loginOptions.email ||
                loginOptions.facebookId ||
                loginOptions.telegramId)) {
                throw new Error();
            }
            const params = {
                name: loginOptions.name,
            };
            if (loginOptions.email) {
                params.email = loginOptions.email;
            }
            if (loginOptions.facebookId) {
                params.facebookId = loginOptions.facebookId;
            }
            if (loginOptions.telegramId) {
                params.telegramId = loginOptions.telegramId;
            }
            user = yield new exports.UserModel(Object.assign(Object.assign({}, params), { token: yield jwt_1.sign(params) })).save();
        }
        return user;
    });
}
exports.getOrCreateUser = getOrCreateUser;
//# sourceMappingURL=user.js.map