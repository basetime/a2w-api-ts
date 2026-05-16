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
const endpoint = '/campaigns';
const enrollmentEndpoint = '/e';
describe('CampaignsEndpoint', () => {
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
    it('getPasses() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const passes = await client.campaigns.getPasses(campaignId);
        expectCommon(url, passes, 'array');
    });
    /**
     *
     */
    it('getPass() should GET /campaigns/:id/passes/details/:passId with the default scanner query', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const scannerStr = encodeURIComponent(JSON.stringify(''));
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
        fetch_mock_1.default.get(url, { id: passId });
        const result = await client.campaigns.getPass(campaignId, passId);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getPass() should JSON-encode a non-empty scanner object into the scanner query', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const scanner = { id: 'S01', kind: 'apple' };
        const scannerStr = encodeURIComponent(JSON.stringify(scanner));
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
        fetch_mock_1.default.get(url, { id: passId });
        const result = await client.campaigns.getPass(campaignId, passId, scanner);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('queryPasses() with no queries should GET /campaigns/:id/passes/query', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'P01' }]);
        const result = await client.campaigns.queryPasses(campaignId);
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('queryPasses() should emit one query[] parameter per entry, URL-encoded', async () => {
        const campaignId = 'C01';
        const queries = { primaryKey: '123455', 'objectStore.amount': '30' };
        const k1 = encodeURIComponent('query[]');
        const v1 = encodeURIComponent('primaryKey:123455');
        const v2 = encodeURIComponent('objectStore.amount:30');
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?${k1}=${v1}&${k1}=${v2}&api=true`;
        fetch_mock_1.default.get(url, [{ id: 'P01' }]);
        const result = await client.campaigns.queryPasses(campaignId, queries);
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('updatePass() should POST /campaigns/:id/passes/details/:passId with the cleaned body', async () => {
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
        const result = await client.campaigns.updatePass(campaignId, passId, body);
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
        const result = await client.campaigns.mergeObjectStore(campaignId, passId, { objectStore: { a: '1' } });
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
        const result = await client.campaigns.deleteObjectStoreKeys(campaignId, passId, keys);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ objectStoreKeys: keys }));
    });
    /**
     *
     */
    it('updatePasses() should POST /campaigns/:id/passes/details/passes with a cleaned passes array', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/passes?api=true`;
        fetch_mock_1.default.post(url, [{ id: 'P01' }]);
        const passes = [
            { id: 'P01', objectStore: { a: '1' }, templateId: 'T01', templateVersion: '1', passTypeIdentifier: 'pti', extraIgnored: 'x' },
        ];
        const result = await client.campaigns.updatePasses(campaignId, passes);
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
        const result = await client.campaigns.appendLog(campaignId, passId, 'hello');
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
        const result = await client.campaigns.createBundle(campaignId, metaValues, objectStore, utm);
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
        await client.campaigns.createBundle(campaignId);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ metaValues: {}, objectStore: {}, utm: {} }));
    });
    /**
     *
     */
    it('createEnrollment() should throw when jwtEncode is not configured', async () => {
        let caught;
        try {
            await client.campaigns.createEnrollment('C01');
        }
        catch (err) {
            caught = err;
        }
        (0, chai_1.expect)(caught).to.be.an.instanceof(Error);
        (0, chai_1.expect)(caught?.message).to.include('jwtEncode');
    });
    /**
     *
     */
    it('createEnrollment() should POST /e/campaign/:id with a jwt-encoded body', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${enrollmentEndpoint}/campaign/${campaignId}?api=true`;
        fetch_mock_1.default.post(url, { pass: 'BUNDLE01', errors: [] });
        client.campaigns.jwtEncode = async () => 'encoded-jwt';
        const result = await client.campaigns.createEnrollment(campaignId, { logo: 'logo.png' }, { form: 'f' });
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ d: 'encoded-jwt' }));
    });
    /**
     *
     */
    it('getPassesByJob() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const jobId = 'JJJJJJ';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${jobId}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const passes = await client.campaigns.getPassesByJob(campaignId, jobId);
        expectCommon(url, passes, 'array');
    });
    /**
     *
     */
    it('getClaims() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/claims?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const claims = await client.campaigns.getClaims(campaignId);
        expectCommon(url, claims, 'array');
    });
    /**
     *
     */
    it('getJobs() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/jobs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const jobs = await client.campaigns.getJobs(campaignId);
        expectCommon(url, jobs, 'array');
    });
    /**
     *
     */
    it('getStats() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/stats?api=true`;
        fetch_mock_1.default.get(url, { countMacType: 1 });
        const stats = await client.campaigns.getStats(campaignId);
        expectCommon(url, stats, 'object');
    });
    /**
     *
     */
    it('getEnrollments() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/enrollments?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const enrollments = await client.campaigns.getEnrollments(campaignId);
        expectCommon(url, enrollments, 'array');
    });
    /**
     *
     */
    it('redeemPass() should POST /campaigns/:id/passes/:passId/redeemed with an empty body', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/redeemed?api=true`;
        fetch_mock_1.default.post(url, true);
        const result = await client.campaigns.redeemPass(campaignId, passId);
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
        const result = await client.campaigns.getRedeemedStatus(campaignId, passId);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal(true);
    });
});
