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
const endpoint = '/campaigns';
describe('CampaignsEndpoint', () => {
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
    it('getAll() should GET /campaigns', async () => {
        const url = `${baseUrl}${endpoint}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'C01' }]);
        const result = await client.campaigns.getAll();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getById() should GET /campaigns/:id', async () => {
        const id = 'C01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.campaigns.getById(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('update() should POST /campaigns/:id with the supplied body', async () => {
        const id = 'C01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const body = { name: 'Renamed', templates: ['T01'] };
        await client.campaigns.update(id, body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('createSimple() should POST /campaigns/:id/simple with the supplied body', async () => {
        const id = '__new';
        const url = `${baseUrl}${endpoint}/${id}/simple?api=true`;
        fetch_mock_1.default.post(url, { id: 'C99' });
        const body = {
            campaign: { name: 'New Simple' },
            templateId: 'T01',
            placeholders: { logo: 'data:image/png;base64,xxx' },
        };
        const result = await client.campaigns.createSimple(id, body);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('clone() should POST /campaigns/:id/clone with an empty body', async () => {
        const id = 'C01';
        const url = `${baseUrl}${endpoint}/${id}/clone?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('C99'));
        const result = await client.campaigns.clone(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal('C99');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({}));
    });
    /**
     *
     */
    it('delete() should DELETE /campaigns/:id', async () => {
        const id = 'C01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.delete(url, JSON.stringify('ok'));
        await client.campaigns.delete(id);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
});
