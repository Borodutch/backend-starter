"use strict";
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
exports.app = void 0;
require("reflect-metadata");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const amala_1 = require("amala");
const cors = require("@koa/cors");
const Router = require("koa-router");
exports.app = new Koa();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const router = new Router();
        yield amala_1.bootstrapControllers({
            app: exports.app,
            router,
            basePath: '/',
            controllers: [__dirname + '/controllers/*'],
            disableVersioning: true,
        });
        exports.app.use(cors({ origin: '*' }));
        exports.app.use(bodyParser());
        exports.app.use(router.routes());
        exports.app.use(router.allowedMethods());
    }
    catch (err) {
        console.log('Koa app starting error: ', err);
    }
}))();
//# sourceMappingURL=app.js.map