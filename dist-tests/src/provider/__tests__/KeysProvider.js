"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const baseUrl = (0, constants_1.getBaseUrl)();
describe('KeysProvider', () => {
    /**
     *
     */
    it('authenticate() should return an idToken', async () => {
        const idToken = 'xxxxxxxx';
        const refreshToken = 'yyyyyyyy';
        fetch_mock_1.default.post(`${baseUrl}/auth/apiGrant`, {
            idToken,
            refreshToken,
            expiresAt: Date.now() + 1000,
        });
        const key = 'api_key';
        const secret = 'api_secret';
        const auth = new index_1.KeysProvider(key, secret, console);
        const token = await auth.authenticate();
        (0, chai_1.expect)(fetch_mock_1.default.called()).to.be.true;
        (0, chai_1.expect)(token).to.be.equal(idToken);
        const lastCall = fetch_mock_1.default.lastCall();
        (0, chai_1.expect)(lastCall).to.not.be.undefined;
        const body = JSON.parse((lastCall?.[1]).body);
        (0, chai_1.expect)(body.key).to.be.equal(key);
        (0, chai_1.expect)(body.secret).to.be.equal(secret);
        fetch_mock_1.default.reset();
    });
});
