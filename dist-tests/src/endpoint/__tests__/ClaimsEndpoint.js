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
const endpoint = '/claim';
describe('ClaimsEndpoint', () => {
    const authUrl = `${baseUrl}/auth/apiGrant`;
    const key = 'api_key';
    const secret = 'api_secret';
    let client;
    /**
     *
     */
    beforeEach(() => {
        const idToken = 'xxxxxxxx';
        const refreshToken = 'yyyyyyyy';
        fetch_mock_1.default.post(authUrl, {
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
     * Run for all tests.
     *
     * @param url The url that should have been called.
     * @param result The result of the fetch call.
     * @param type The type of the result.
     */
    const expectCommon = (url, result, type) => {
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an(type);
    };
    /**
     *
     */
    it('getPkpass() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const passId = 'PPPPPP';
        const url = `${baseUrl}${endpoint}/${campaignId}/${passId}.pkpass?api=true`;
        fetch_mock_1.default.get(url, 'PKPASS');
        const passes = await client.claims.getPkpass(campaignId, passId);
        expectCommon(url, passes, 'string');
    });
});
