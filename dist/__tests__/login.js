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
const request = require('supertest');
const app_1 = require("@/app");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const index_1 = require("@/models/index");
const axios_mock_adapter_1 = require("axios-mock-adapter");
const axios_1 = require("axios");
const testUtils_1 = require("./testUtils");
const user_1 = require("@/models/user");
describe('Login endpoint', () => {
    const axiosMock = new axios_mock_adapter_1.default(axios_1.default);
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoServer = new mongodb_memory_server_1.MongoMemoryServer();
        yield index_1.runMongo(yield mongoServer.getUri());
        server = yield testUtils_1.startKoa(app_1.app);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield testUtils_1.dropMongo();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.stopMongo();
        yield testUtils_1.stopServer(server);
    }));
    it('should return user for valid /google request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.UserModel.create(testUtils_1.completeUser);
        axiosMock
            .onGet('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=test')
            .reply(200, {
            name: 'Alexander Brennenburg',
            email: 'alexanderrennenburg@gmail.com',
        });
        const response = yield request(server)
            .post('/login/google')
            .send({ accessToken: 'test' });
        expect(response.body.name).toBe('Alexander Brennenburg');
        expect(response.body.email).toBe('alexanderrennenburg@gmail.com');
    }));
});
//# sourceMappingURL=login.js.map