"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const baseUrl = constants_1.DEFAULT_BASE_URL;
describe('OAuthProvider', () => {
    /**
     *
     */
    it('getCodeUrl() should return a URL', async () => {
        const app = 'app';
        const oauth = new index_1.OAuthProvider(app, '@', console);
        const url = oauth.getCodeUrl('redirect', ['scope1', 'scope2'], 'state');
        (0, chai_1.expect)(url).to.be.equal(`${baseUrl}/auth/oauth/code?app=${app}&redirectUrl=redirect&scope=scope1%20scope2&state=state`);
    });
    /**
     *
     */
    it('authenticate() should return an idToken', async () => {
        const idToken = 'xxxxxxxx';
        const refreshToken = 'yyyyyyyy';
        fetch_mock_1.default.post(`${baseUrl}/auth/oauth/token`, {
            idToken,
            refreshToken,
            expiresAt: Date.now() + 1000,
        });
        const appId = 'app';
        const code = 'code';
        const oauth = new index_1.OAuthProvider(appId, code, console);
        const token = await oauth.authenticate();
        (0, chai_1.expect)(fetch_mock_1.default.called()).to.be.true;
        (0, chai_1.expect)(token).to.be.equal(idToken);
        const lastCall = fetch_mock_1.default.lastCall();
        (0, chai_1.expect)(lastCall).to.not.be.undefined;
        const body = JSON.parse((lastCall?.[1]).body);
        (0, chai_1.expect)(body.app).to.be.equal(appId);
        (0, chai_1.expect)(body.code).to.be.equal(code);
        fetch_mock_1.default.reset();
    });
});
