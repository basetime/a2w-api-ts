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
const endpoint = '/images';
describe('ImagesEndpoint', () => {
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
     * Run for authenticated tests.
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
    it('getById() should GET /images/:id', async () => {
        const id = 'IMG01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.images.getById(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getByIds() should GET /images/ids with comma-joined ids query', async () => {
        const ids = ['IMG01', 'IMG02', 'IMG03'];
        const url = `${baseUrl}${endpoint}/ids?ids=${encodeURIComponent(ids.join(','))}&api=true`;
        fetch_mock_1.default.get(url, [{ id: 'IMG01' }]);
        const result = await client.images.getByIds(ids);
        expectCommon(url, result, 'array');
    });
});
