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
const endpoint = '/templates';
describe('TemplatesEndpoint', () => {
    const authUrl = `${baseUrl}/auth/apiGrant`;
    const key = 'api_key';
    const secret = 'api_secret';
    let client;
    /**
     *
     */
    beforeEach(() => {
        fetch_mock_1.default.post(authUrl, {
            idToken: 'xxxxxxxx',
            refreshToken: 'yyyyyyyy',
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
     * Run for all authenticated tests.
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
    it('getById() should GET /templates/simple/:id', async () => {
        const id = 'TPL01';
        const url = `${baseUrl}${endpoint}/simple/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.templates.getById(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getAll() should GET /templates/organization', async () => {
        const url = `${baseUrl}${endpoint}/organization?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'TPL01' }]);
        const result = await client.templates.getAll();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getByTag() should GET /templates/tagged/:tag', async () => {
        const tag = 'promo';
        const url = `${baseUrl}${endpoint}/tagged/${tag}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'TPL01' }]);
        const result = await client.templates.getByTag(tag);
        expectCommon(url, result, 'array');
    });
});
