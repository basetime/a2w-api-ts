"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../constants");
const index_1 = require("../index");
const baseUrl = (0, constants_1.getBaseUrl)();
describe('Client', () => {
    const key = 'api_key';
    const secret = 'api_secret';
    let client;
    /**
     *
     */
    beforeEach(() => {
        const idToken = 'xxxxxxxx';
        const refreshToken = 'yyyyyyyy';
        fetch_mock_1.default.post(`${baseUrl}/auth/apiGrant`, {
            idToken,
            refreshToken,
            expiresAt: Date.now() + 1000,
        });
        const auth = new index_1.KeysProvider(key, secret, console);
        client = new index_1.Client(auth);
    });
    /**
     *
     */
    afterEach(() => {
        fetch_mock_1.default.reset();
    });
    /**
     *
     */
    it('fetch() should succeed', async () => {
        fetch_mock_1.default.get(`${baseUrl}/campaigns?api=true`, { campaigns: [] });
        await client.http.fetch('/campaigns', {});
        const lastCalled = fetch_mock_1.default.lastCall();
        (0, chai_1.expect)(lastCalled).to.not.be.undefined;
        (0, chai_1.expect)(lastCalled?.[0]).to.be.equal(`${baseUrl}/campaigns?api=true`);
    });
    /**
     *
     */
    it('should return endpoints', () => {
        (0, chai_1.expect)(client.campaigns).to.be.instanceOf(index_1.CampaignsEndpoint);
        (0, chai_1.expect)(client.claims).to.be.instanceOf(index_1.ClaimsEndpoint);
    });
});
