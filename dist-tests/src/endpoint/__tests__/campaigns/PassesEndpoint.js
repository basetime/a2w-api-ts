"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../../constants");
const index_1 = require("../../../index");
const baseUrl = (0, constants_1.getBaseUrl)();
const endpoint = '/campaigns';
describe('CampaignPassesEndpoint', () => {
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
    it('getAll() should GET /campaigns/:id/passes', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const passes = await client.campaigns.passes.getAll(campaignId);
        expectCommon(url, passes, 'array');
    });
    /**
     *
     */
    it('getById() should GET /campaigns/:id/passes/details/:passId with the default scanner query', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const scannerStr = encodeURIComponent(JSON.stringify(''));
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
        fetch_mock_1.default.get(url, { id: passId });
        const result = await client.campaigns.passes.getById(campaignId, passId);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getById() should JSON-encode a non-empty scanner object into the scanner query', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const scanner = { id: 'S01', kind: 'apple' };
        const scannerStr = encodeURIComponent(JSON.stringify(scanner));
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
        fetch_mock_1.default.get(url, { id: passId });
        const result = await client.campaigns.passes.getById(campaignId, passId, scanner);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('query() with no queries should GET /campaigns/:id/passes/query', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'P01' }]);
        const result = await client.campaigns.passes.query(campaignId);
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('query() should emit one query[] parameter per entry, URL-encoded', async () => {
        const campaignId = 'C01';
        const queries = { primaryKey: '123455', 'objectStore.amount': '30' };
        const k1 = encodeURIComponent('query[]');
        const v1 = encodeURIComponent('primaryKey:123455');
        const v2 = encodeURIComponent('objectStore.amount:30');
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?${k1}=${v1}&${k1}=${v2}&api=true`;
        fetch_mock_1.default.get(url, [{ id: 'P01' }]);
        const result = await client.campaigns.passes.query(campaignId, queries);
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('update() should POST /campaigns/:id/passes/details/:passId with the cleaned body', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?api=true`;
        fetch_mock_1.default.post(url, { id: passId });
        const body = {
            objectStore: { foo: 'bar' },
            templateId: 'T01',
            templateVersion: 1,
            passTypeIdentifier: 'pass.com.example',
        };
        const result = await client.campaigns.passes.update(campaignId, passId, body);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('mergeObjectStore() should PUT /campaigns/:id/passes/details/:passId with only objectStore', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?api=true`;
        fetch_mock_1.default.put(url, { id: passId });
        const result = await client.campaigns.passes.mergeObjectStore(campaignId, passId, { objectStore: { a: '1' } });
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('PUT');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ objectStore: { a: '1' } }));
    });
    /**
     *
     */
    it('deleteObjectStoreKeys() should DELETE /campaigns/:id/passes/details/:passId with the keys body', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?api=true`;
        fetch_mock_1.default.delete(url, { id: passId });
        const keys = ['a', 'b'];
        const result = await client.campaigns.passes.deleteObjectStoreKeys(campaignId, passId, keys);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ objectStoreKeys: keys }));
    });
    /**
     *
     */
    it('updateMany() should POST /campaigns/:id/passes/details/passes with a cleaned passes array', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/passes?api=true`;
        fetch_mock_1.default.post(url, [{ id: 'P01' }]);
        const passes = [
            { id: 'P01', objectStore: { a: '1' }, templateId: 'T01', templateVersion: '1', passTypeIdentifier: 'pti', extraIgnored: 'x' },
        ];
        const result = await client.campaigns.passes.updateMany(campaignId, passes);
        expectCommon(url, result, 'array');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({
            passes: [
                {
                    id: 'P01',
                    objectStore: { a: '1' },
                    templateId: 'T01',
                    templateVersion: '1',
                    passTypeIdentifier: 'pti',
                },
            ],
        }));
    });
    /**
     *
     */
    it('appendLog() should POST /campaigns/:id/passes/:passId/logs with the log body', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/logs?api=true`;
        fetch_mock_1.default.post(url, { id: passId });
        const result = await client.campaigns.passes.appendLog(campaignId, passId, 'hello');
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ log: 'hello' }));
    });
    /**
     *
     */
    it('createBundle() should POST /campaigns/:id/passes/bundle with the supplied values', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/bundle?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('https://example/claim'));
        const metaValues = { logo: 'logo.png' };
        const objectStore = { amount: 30 };
        const utm = { utm_source: 'test' };
        const result = await client.campaigns.passes.createBundle(campaignId, metaValues, objectStore, utm);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal('https://example/claim');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ metaValues, objectStore, utm }));
    });
    /**
     *
     */
    it('createBundle() should default metaValues/objectStore/utm to empty objects', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/bundle?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('https://example/claim'));
        await client.campaigns.passes.createBundle(campaignId);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ metaValues: {}, objectStore: {}, utm: {} }));
    });
    /**
     *
     */
    it('getByJob() should GET /campaigns/:id/passes/:jobId', async () => {
        const campaignId = 'UUUUUU';
        const jobId = 'JJJJJJ';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${jobId}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const passes = await client.campaigns.passes.getByJob(campaignId, jobId);
        expectCommon(url, passes, 'array');
    });
    /**
     *
     */
    it('redeem() should POST /campaigns/:id/passes/:passId/redeemed with an empty body', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/redeemed?api=true`;
        fetch_mock_1.default.post(url, true);
        const result = await client.campaigns.passes.redeem(campaignId, passId);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal(true);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({}));
    });
    /**
     *
     */
    it('getRedeemedStatus() should GET /campaigns/:id/passes/:passId/redeemed', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/redeemed?api=true`;
        fetch_mock_1.default.get(url, true);
        const result = await client.campaigns.passes.getRedeemedStatus(campaignId, passId);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal(true);
    });
    /**
     *
     */
    it('getScannerLogs() should GET /campaigns/:id/passes/:passId/scannerLogs', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/scannerLogs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'LOG01' }]);
        const result = await client.campaigns.passes.getScannerLogs(campaignId, passId);
        expectCommon(url, result, 'array');
    });
});
